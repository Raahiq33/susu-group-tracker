
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
}

module.exports = SusuGroup;
