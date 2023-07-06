# Change Log

### v0.1.0 - Initial Release

- Ability to search for a set using the official Lego set number, then when you want to add that set to the table, clicking add which then grabs all sales data from BrickLink and adds it to the table.
- Similarly, the ability to search for minifigs using BrickLink's id for the minifig, then does the same thing, grabbing all the sales data and adding it to the table.
- Ability to add custom items, with name, type, and value.  Based on the type (Other, Bulk, Set, Minifig), adds a row icon to the table instead of a set image.
- Search function which opens a new tab in BrickLink, since they don't provide a search API.
- A fully fleshed out table, which has data from BrickLink on the item, plus estimated value, a slider to manually set the value based on a percentage, and comments/notes.
- A totals section, which takes the value of all rows from the table and sums it up.  Also has a "Store Credit" field that is a higher percentage of the estimated value for store credit instead of cash trade in.
- A configuration card that lets you toggled between "store mode" and "customer mode" which is a stripped down version and hides some sales data fields.  Also has a "Reset Calculations" button and a print button.

### v0.1.1 - Interim Update

*This is mostly so users can use it in the middle of development*

- Added BrickEconomyService, which scrapes page data from brickeconomy.com using a search url.  Grabs the availability ("Retail" and "Retired") and the MSRP of the set.  Added the availability to the Year column, and added a label on the Value column for MSRP if the set is currently available at retail.
- Fixed a bug on the BrickLink search card where when you perform the search, the page would refresh, losing all the data on the screen (will fix the losing data on refresh in a later release with Redux)
- Modified the currency inputs to have a better control on the inputs.  Before, you could put in commas and decimals anywhere and the app would accept it and throw errors.  Now it only accepts one decimal point and adds commas on blur automatically.
- Added configuration for grayscale printing by default
- Modified value calculations (50% for used sets, 60% for new sets), and took the retail availability into account

### v0.1.2 - Interim Update 2

- Added the ability to press enter on the comment field
- Fixed a bug where you could set the condition to neither New nor Used
- Made the More Information modal a static height, added the retail and MSRP to it, and made the ux a bit smoother
- Modified value calculation, used retail availability sets should use BrickLink base price

### v0.2.0 - Functionality Implementation from First Feedback Session

- Added a bulk load dialog that accepts many set numbers and searches for them all
- Removed Type dropdown on Item Search Card, so now it just checks against a regex.  If the id starts with letters then has numbers, it's a minifig, else it's a set.
- Set the value text field to red if the value is over $100
- Set the text color on the BrickLink sales cells to red if there are less than 10 sales, green if there are 10 or more sales
- Modified the adjustment sliders, row items are now 0% to 100%, starting at the new/used base percentage, total slider is now -50% to 50%, starting at 0%
- Added a Settings Dialog, which has the functionality to set bulk condition, reset calculations, and some disabled fields for auto adjustment fields (coming soon to a future release near you)
- Added a Multiple Match Dialog, which tells you if the id you put in has multiple matches found in Bricklink (i.e. 7670-1 and 7670-2)