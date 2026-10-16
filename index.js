
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

group.recordContribution("Ama", 1, "50.00");
group.recordContribution("Kofi", 1, "50.00");
group.recordContribution("Esi", 1, "30.00");

group.showReport();

console.log("\n--- ATTEMPT TO CLOSE WEEK 1 ---");
console.log(group.closeWeek());

console.log("\n--- ESI PAYS REMAINING 20.00 ---");
console.log(
  group.recordContribution("Esi", 1, "20.00")
);

console.log("\n--- CLOSE WEEK 1 ---");
console.log(group.closeWeek());

group.showReport();

console.log("\n--- WEEK 2 PAYMENTS ---");

group.recordContribution("Ama", 2, "50.00");
group.recordContribution("Kofi", 2, "50.00");
group.recordContribution("Esi", 2, "50.00");

console.log("\n--- CLOSE WEEK 2 ---");
console.log(group.closeWeek());

group.showReport();
