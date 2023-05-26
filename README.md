# Set Checker

### High Level

Provides the ability to input set numbers to provide suggested pricing based on sales history from BrickLink.  There will be some configuration options for each set number to accurately price based on condition, completeness, etc.

### Requirements

1. Ability to input set numbers to an input field or directly onto the table, which then gets sales data on that specified set populated to the table.
2. Ability to adjust price for each row with a slider (+/- percentage) that updates the price on the row for that set.
3. Ability to adjust the total price with a slider that reflects only the total.
4. Ability to print out the report in a Minifig Shop view that shows all the data available (BrickLink pricing, adjustment slider value, etc.)
5. Ability to print out the report in a customer view that shows only the set information without sales info, and The Minifig Shop's buy offer.
6. Ability to input custom values as row items without any sales data (Minifigures, bulk containers, etc.)

### Nice to Haves / Phase II

1. MSRP values for sets currently still being produced. (Will need to find out how to get that indicator and information)
2. Data storage to store quotes in.
3. Listing direct to BrickLink.

### Table Data

- Set Number/Indicator
- Set Name
- Min Price (with tooltip stating sample size)
- Average Price (with tooltip stating sample size)
- Max Price (with tooltip stating sample size)
- MSRP?
- Slider for manual price adjustment
- Notes/Comments