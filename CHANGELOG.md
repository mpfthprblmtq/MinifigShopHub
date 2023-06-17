# Change Log

### v0.1.0 - Initial Release

- Ability to search for a set using the official Lego set number, then when you want to add that set to the table, clicking add which then grabs all sales data from BrickLink and adds it to the table.
- Similarly, the ability to search for minifigs using BrickLink's id for the minifig, then does the same thing, grabbing all the sales data and adding it to the table.
- Ability to add custom items, with name, type, and value.  Based on the type (Other, Bulk, Set, Minifig), adds a row icon to the table instead of a set image.
- Search function which opens a new tab in BrickLink, since they don't provide a search API.
- A fully fleshed out table, which has data from BrickLink on the item, plus estimated value, a slider to manually set the value based on a percentage, and comments/notes.
- A totals section, which takes the value of all rows from the table and sums it up.  Also has a "Store Credit" field that is a higher percentage of the estimated value for store credit instead of cash trade in.
- A configuration card that lets you toggled between "store mode" and "customer mode" which is a stripped down version and hides some sales data fields.  Also has a "Reset Calculations" button and a print button.

### v0.2.0 - Updates After First Client Feedback Session

- Modified the currency inputs to have a better control on the inputs.  Before, you could put in commas and decimals anywhere and the app would accept it and throw errors.  Now it only accepts one decimal point and adds commas on blur automatically.
- 