
const SusuGroup = require("./src/SusuGroup");

console.log("================================");
console.log("       SUSU GROUP TRACKER       ");
console.log("================================");

const group = new SusuGroup("50.00");

group.addMember("Ama");
group.addMember("Kofi");
group.addMember("Esi");

group.showMembers();
