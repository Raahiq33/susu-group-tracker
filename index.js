
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const SusuGroup = require("./src/SusuGroup");

const rl = readline.createInterface({ input, output });

let group = null;

function requireGroup() {
  if (!group) {
    throw new Error("Please create a group first.");
  }
}

function showMenu() {
  console.log("\n========== MAIN MENU ==========");
  console.log("1. Create Savings Group");
  console.log("2. Add Member");
  console.log("3. Record Contribution");
  console.log("4. Close Current Week");
  console.log("5. View Group Report");
  console.log("6. Exit");
  console.log("================================");
}

async function main() {
  console.log("================================");
  console.log("       SUSU GROUP TRACKER");
  console.log("================================");
  console.log("Savings Group Management System");

  try {
    while (true) {
      showMenu();

      const choice = (
        await rl.question("Choose an option (1-6): ")
      ).trim();

      try {
        switch (choice) {
          case "1": {
            if (group) {
              console.log("A group already exists.");
              break;
            }

            const amount = await rl.question(
              "Enter weekly contribution (GHS): "
            );

            group = new SusuGroup(amount.trim());

            console.log(
              "Savings group created successfully!"
            );
            break;
          }

          case "2": {
            requireGroup();

            const name = await rl.question(
              "Enter member name: "
            );

            const member = group.addMember(name);

            console.log(
              `Member ${member} added successfully!`
            );
            break;
          }

          case "3": {
            requireGroup();

            const name = await rl.question(
              "Enter member name: "
            );

            const week = await rl.question(
              "Enter week number: "
            );

            const amount = await rl.question(
              "Enter payment amount (GHS): "
            );

            const result = group.recordContribution(
              name,
              Number(week),
              amount.trim()
            );

            console.log(
              `Payment recorded for ${result.member}`
            );
            console.log(`Total paid: GHS ${result.paid}`);
            console.log(
              `Remaining balance: GHS ${result.remaining}`
            );
            break;
          }

          case "4": {
            requireGroup();

            const result = group.closeWeek();

            if (!result.closed) {
              console.log(
                "\nWeek cannot close. Payments pending:"
              );

              result.owing.forEach(item => {
                console.log(
                  `${item.member} owes GHS ${item.amount}`
                );
              });
            } else {
              console.log(
                `\nWeek ${result.week} closed!`
              );
              console.log(
                `${result.recipient} receives GHS ${result.payout}`
              );
              console.log(
                `Week ${result.nextWeek} has started.`
              );
            }
            break;
          }

          case "5": {
            requireGroup();
            group.showReport();
            break;
          }

          case "6": {
            console.log("Thank you for using Susu Group Tracker!");
            return;
          }

          default:
            console.log(
              "Invalid option. Please choose 1-6."
            );
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  } finally {
    rl.close();
  }
}

main().catch(error => {
  console.error("Unexpected error:", error.message);
  process.exitCode = 1;
});
