
const { parseGhs, formatGhs } = require("./money");

class SusuGroup {
  constructor(weeklyAmountGhs) {
    const amount = parseGhs(weeklyAmountGhs);

    if (amount <= 0) {
      throw new Error("Weekly amount must be positive");
    }

    this.weeklyContribution = amount;
    this.members = [];
    this.currentWeek = 1;
    this.payments = new Map();
    this.payoutHistory = [];
    this.started = false;
  }

  addMember(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Member name cannot be empty");
    }

    if (this.started) {
      throw new Error(
        "Cannot add members after payments have started"
      );
    }

    const cleanName = name.trim();

    const duplicate = this.members.some(
      member =>
        member.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      throw new Error("Member already exists");
    }

    this.members.push(cleanName);
    this.payments.set(cleanName, 0);

    return cleanName;
  }

  recordContribution(name, week, amountGhs) {
    if (!Number.isInteger(week) ||
        week !== this.currentWeek) {
      throw new Error(
        "Payments are allowed only for the current week"
      );
    }

    const member = this.members.find(
      m => m.toLowerCase() ===
        String(name).trim().toLowerCase()
    );

    if (!member) {
      throw new Error("Unknown member");
    }

    const amount = parseGhs(amountGhs);

    if (amount <= 0) {
      throw new Error("Payment must be positive");
    }

    const alreadyPaid = this.payments.get(member);
    const remaining =
      this.weeklyContribution - alreadyPaid;

    if (amount > remaining) {
      throw new Error(
        `Payment exceeds remaining balance. Owed: GHS ${formatGhs(remaining)}`
      );
    }

    this.payments.set(member, alreadyPaid + amount);
    this.started = true;

    return {
      member,
      week,
      paid: formatGhs(this.payments.get(member)),
      remaining: formatGhs(remaining - amount)
    };
  }

  getReport() {
    const paidInFull = [];
    const owing = [];

    for (const member of this.members) {
      const paid = this.payments.get(member);
      const remaining = this.weeklyContribution - paid;

      if (remaining === 0) {
        paidInFull.push(member);
      } else {
        owing.push({
          member,
          amount: formatGhs(remaining)
        });
      }
    }

    return {
      currentWeek: this.currentWeek,
      weeklyContribution: formatGhs(
        this.weeklyContribution
      ),
      paidInFull,
      owing,
      payoutHistory: this.payoutHistory.map(
        payout => ({ ...payout })
      )
    };
  }

  closeWeek() {
    if (this.members.length === 0) {
      throw new Error(
        "Cannot close a week without members"
      );
    }

    const report = this.getReport();

    if (report.owing.length > 0) {
      return {
        closed: false,
        week: this.currentWeek,
        message: "Week cannot close. Payments pending.",
        owing: report.owing
      };
    }

    const totalPot =
      this.weeklyContribution * this.members.length;

    if (!Number.isSafeInteger(totalPot)) {
      throw new Error("Total pot is too large");
    }

    const recipientIndex =
      (this.currentWeek - 1) % this.members.length;

    const recipient = this.members[recipientIndex];
    const closedWeek = this.currentWeek;

    const payout = {
      week: closedWeek,
      recipient,
      amount: formatGhs(totalPot)
    };

    this.payoutHistory.push(payout);
    this.started = true;
    this.currentWeek++;

    this.payments = new Map(
      this.members.map(member => [member, 0])
    );

    return {
      closed: true,
      week: closedWeek,
      recipient,
      payout: formatGhs(totalPot),
      nextWeek: this.currentWeek
    };
  }

  showMembers() {
    console.log("\n--- GROUP DETAILS ---");
    console.log(
      "Weekly Contribution: GHS " +
      formatGhs(this.weeklyContribution)
    );
    console.log("Current Week:", this.currentWeek);
    console.log("Members:");

    this.members.forEach((member, index) => {
      console.log(`${index + 1}. ${member}`);
    });
  }

  showReport() {
    const report = this.getReport();

    console.log("\n========== GROUP REPORT ==========");
    console.log("Current Week:", report.currentWeek);
    console.log(
      "Weekly Contribution: GHS",
      report.weeklyContribution
    );

    console.log("\nPaid in Full:");
    if (report.paidInFull.length === 0) {
      console.log("None");
    } else {
      report.paidInFull.forEach(name =>
        console.log(`- ${name}`)
      );
    }

    console.log("\nOutstanding Payments:");
    if (report.owing.length === 0) {
      console.log("None");
    } else {
      report.owing.forEach(item => {
        console.log(
          `- ${item.member} owes GHS ${item.amount}`
        );
      });
    }

    console.log("\nPayout History:");
    if (report.payoutHistory.length === 0) {
      console.log("No payouts yet");
    } else {
      report.payoutHistory.forEach(payout => {
        console.log(
          `Week ${payout.week}: ${payout.recipient} received GHS ${payout.amount}`
        );
      });
    }

    console.log("==================================");
  }
}

module.exports = SusuGroup;
