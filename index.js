
const SusuGroup = require("./src/SusuGroup");

console.log("================================");
console.log("       SUSU GROUP TRACKER       ");
console.log("================================");

const group = new SusuGroup("50.00");

group.addMember("Ama");
group.addMember("Kofi");
group.addMember("Esi");

group.showMembers();

console.log("\n--- WEEK 1 PAYMENTS ---");

console.log(
  group.recordContribution("Ama", 1, "50.00")
);

console.log(
  group.recordContribution("Kofi", 1, "50.00")
);

console.log(
  group.recordContribution("Esi", 1, "30.00")
);

console.log("\n--- ESI REMAINING PAYMENT ---");

console.log(
  group.recordContribution("Esi", 1, "20.00")
);
