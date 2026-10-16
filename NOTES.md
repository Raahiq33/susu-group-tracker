
# Project Notes

## Assumptions

1. Each savings group has a fixed weekly contribution.
2. All members pay the same amount each week.
3. Member names must be unique, ignoring letter case.
4. Members receive payouts in the order they joined.
5. New members cannot join after the first payment has been recorded.
6. Contributions are accepted only for the current week.
7. Partial payments are allowed.
8. A week cannot close while any member has an outstanding balance.
9. The payout recipient rotates after each completed week and cycles back to the first member after the last member.
10. The application manages one group per session.

## Design Decisions

### JavaScript and Node.js

JavaScript was selected because it is suitable for building a lightweight command-line application without requiring a graphical interface.

### Exact Money Handling

Money is converted into integer pesewas for calculations to avoid floating-point rounding errors.

For example, GHS 50.00 is stored as 5000 pesewas.

### Application Structure

The project separates responsibilities:

- `SusuGroup.js` manages the savings group and business rules.
- `money.js` handles monetary conversion and formatting.
- `index.js` provides the command-line interface.
- `SusuGroup.test.js` contains automated tests.

### Payment and Payout Rules

Each member must fully pay the weekly contribution before the group can close the week.

If payments are incomplete, the program returns the outstanding balances without making a payout.

When all members have paid, the total pot is assigned to the next member in joining order.

## Testing

The application includes 12 automated tests covering the main business rules, validation and monetary accuracy.

## Known Limitations

- Application data is not saved between sessions.
- The program supports one group at a time.
- No real payment gateway or bank transfer is integrated.
- No user authentication is implemented.

## Future Improvements

With more time, I would:

1. Add persistent storage using a database.
2. Support multiple savings groups.
3. Add data export and transaction records.
4. Introduce user authentication.
5. Improve error handling and test coverage.
6. Develop an API for future integration.

## Reflection

This project helped me practise object-oriented programming, validation, automated testing, accurate money handling and Git version control.
