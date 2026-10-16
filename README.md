
# Susu Group Tracker

A command-line application for managing a rotating savings group (Susu), built using JavaScript and Node.js.

## Features

- Create a savings group with a fixed weekly contribution in GHS
- Add members with unique names
- Record full and partial contributions
- Prevent invalid and excessive payments
- Close a week only when all members have paid
- Rotate payouts according to joining order
- View outstanding balances and payout history
- Handle monetary amounts using integer pesewas

## Requirements

- Node.js 20 or later
- Git (for version control)

No external npm dependencies are required.

## How to Run

Open a terminal in the project folder:

```bash
node index.js
```

The application displays an interactive menu:

1. Create Savings Group
2. Add Member
3. Record Contribution
4. Close Current Week
5. View Group Report
6. Exit

## Example

Create a group with a weekly contribution of GHS 50.00.

Add three members:

- Ama
- Kofi
- Esi

Week 1 payments:

- Ama: GHS 50.00
- Kofi: GHS 50.00
- Esi: GHS 30.00

Attempting to close Week 1 fails because Esi owes GHS 20.00.

After Esi pays the remaining GHS 20.00, Week 1 closes and Ama receives a payout of GHS 150.00.

Week 2 starts with Kofi as the next recipient.

## Automated Tests

Run:

```bash
npm test
```

On Windows PowerShell, use:

```powershell
npm.cmd test
```

The project includes 12 automated tests using the built-in Node.js test runner.

Tests cover group creation, duplicate members, unknown members, partial payments, full payments, invalid amounts, overpayments, week validation, blocked week closure, successful payouts, payout rotation, and exact money calculations.

## Project Structure

```text
susu-group-tracker/
├── src/
│   ├── SusuGroup.js
│   └── money.js
├── tests/
│   └── SusuGroup.test.js
├── index.js
├── package.json
├── README.md
└── NOTES.md
```

## Limitations

- Data is stored in memory and resets when the application exits.
- Only one savings group is managed per application session.
- Payouts are recorded logically; no real bank transactions occur.

See NOTES.md for assumptions and future improvements.

## Author

Mohamed Raahiq

Software Engineering Student
