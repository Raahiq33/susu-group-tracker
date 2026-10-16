
const test = require("node:test");
const assert = require("node:assert/strict");

const SusuGroup = require("../src/SusuGroup");
const { parseGhs, formatGhs } = require("../src/money");

function createSampleGroup() {
  const group = new SusuGroup("50.00");

  group.addMember("Ama");
  group.addMember("Kofi");
  group.addMember("Esi");

  return group;
}

// Test 1: Group creation
test("Creates a group with correct weekly contribution", () => {
  const group = createSampleGroup();

  assert.equal(group.weeklyContribution, 5000);
  assert.equal(group.currentWeek, 1);
  assert.equal(group.members.length, 3);
});

// Test 2: Duplicate members
test("Rejects duplicate member names", () => {
  const group = createSampleGroup();

  assert.throws(() => {
    group.addMember("ama");
  }, /already exists/);
});

// Test 3: Unknown member
test("Rejects payments from unknown members", () => {
  const group = createSampleGroup();

  assert.throws(() => {
    group.recordContribution("John", 1, "50.00");
  }, /Unknown member/);
});

// Test 4: Full payment
test("Records full contribution correctly", () => {
  const group = createSampleGroup();

  const result = group.recordContribution(
    "Ama", 1, "50.00"
  );

  assert.equal(result.paid, "50.00");
  assert.equal(result.remaining, "0.00");
  assert.ok(group.getReport().paidInFull.includes("Ama"));
});

// Test 5: Partial payment
test("Accepts partial payments and calculates balance", () => {
  const group = createSampleGroup();

  const first = group.recordContribution(
    "Esi", 1, "30.00"
  );

  assert.equal(first.remaining, "20.00");

  const second = group.recordContribution(
    "Esi", 1, "20.00"
  );

  assert.equal(second.paid, "50.00");
  assert.equal(second.remaining, "0.00");
});

// Test 6: Invalid payment amounts
test("Rejects zero and negative payments", () => {
  const group = createSampleGroup();

  assert.throws(() => {
    group.recordContribution("Ama", 1, "0.00");
  });

  assert.throws(() => {
    group.recordContribution("Ama", 1, "-10.00");
  });
});

// Test 7: Overpayment
test("Rejects payment exceeding amount owed", () => {
  const group = createSampleGroup();

  assert.throws(() => {
    group.recordContribution("Ama", 1, "60.00");
  }, /exceeds remaining balance/);
});

// Test 8: Wrong week
test("Rejects payments for another week", () => {
  const group = createSampleGroup();

  assert.throws(() => {
    group.recordContribution("Ama", 2, "50.00");
  }, /current week/);
});

// Test 9: Cannot close incomplete week
test("Does not close week when a member owes money", () => {
  const group = createSampleGroup();

  group.recordContribution("Ama", 1, "50.00");
  group.recordContribution("Kofi", 1, "50.00");
  group.recordContribution("Esi", 1, "30.00");

  const result = group.closeWeek();

  assert.equal(result.closed, false);
  assert.equal(group.currentWeek, 1);
  assert.equal(group.payoutHistory.length, 0);

  assert.deepEqual(result.owing, [
    { member: "Esi", amount: "20.00" }
  ]);
});

// Test 10: Successful payout
test("Closes fully paid week and pays first member", () => {
  const group = createSampleGroup();

  group.recordContribution("Ama", 1, "50.00");
  group.recordContribution("Kofi", 1, "50.00");
  group.recordContribution("Esi", 1, "50.00");

  const result = group.closeWeek();

  assert.equal(result.closed, true);
  assert.equal(result.recipient, "Ama");
  assert.equal(result.payout, "150.00");
  assert.equal(group.currentWeek, 2);
});

// Test 11: Payout rotation
test("Pays members in correct joining order", () => {
  const group = createSampleGroup();

  for (let week = 1; week <= 2; week++) {
    for (const member of group.members) {
      group.recordContribution(member, week, "50.00");
    }
    group.closeWeek();
  }

  assert.equal(group.payoutHistory[0].recipient, "Ama");
  assert.equal(group.payoutHistory[1].recipient, "Kofi");
  assert.equal(group.currentWeek, 3);
});

// Test 12: Exact money calculations
test("Handles money without decimal rounding errors", () => {
  assert.equal(parseGhs("0.10"), 10);
  assert.equal(parseGhs("0.20"), 20);
  assert.equal(formatGhs(30), "0.30");

  const group = new SusuGroup("0.30");
  group.addMember("Ama");
  group.addMember("Kofi");

  group.recordContribution("Ama", 1, "0.10");
  group.recordContribution("Ama", 1, "0.20");
  group.recordContribution("Kofi", 1, "0.30");

  const result = group.closeWeek();

  assert.equal(result.closed, true);
  assert.equal(result.payout, "0.60");
});
