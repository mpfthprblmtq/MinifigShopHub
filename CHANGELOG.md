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

### v1.0.0 - Functionality Implementation from First Feedback Session

- Added a bulk load dialog that accepts many set numbers and searches for them all
- Removed Type dropdown on Item Search Card, so now it just checks against a regex.  If the id starts with letters then has numbers, it's a minifig, else it's a set.
- Set the value text field to red if the value is over $100
- Set the text color on the BrickLink sales cells to red if there are less than 10 sales, green if there are 10 or more sales
- Modified the adjustment sliders, row items are now 0% to 100%, starting at the new/used base percentage, total slider is now -50% to 50%, starting at 0%
- Added a Settings Dialog, which has the functionality to set bulk condition, reset calculations, and some disabled fields for auto adjustment fields (coming soon to a future release near you)
- Added a Multiple Match Dialog, which tells you if the id you put in has multiple matches found in Bricklink (i.e. 7670-1 and 7670-2)

### v1.1.0 - Pricing Bugs and small visual enhancements

- Fixed bug where with no sales data, base value, value, and adjustment would go wonky and not look right
  - Now, if there is no sales data for either new or used, value gets set to 0 and the manual adjustment slider is locked at 0% and disabled, since there's no good data to base a baseline off of
  - Also refactored the price calculation to live in its own priceCalculationEngine hook, so all the logic is centralized
- Made the Value text field have a red outline if the value in it is $0.00
- Disabled and locked the manual adjustment slider to 0% if the item is custom

### v1.2.0 - Database functionality and adjustment slider updates

- Configuration (store credit adjustment percentage, used auto-adjustment percentage, new auto-adjustment percentage) are all now sourced from database
  - Can modify these values in the Settings dialog, which then propagates to the database
- Total adjustment slider gets disabled when you make adjustments to individual rows.  Inversely, row sliders get disabled when you make any total adjustments
- Added Redux

### v1.2.1

- Set the text color on the BrickLink sales cells to red if there are less than 5 sales, green if there are 5 or more sales, threshold was originally 10

### v2.0.0

- Added Label Maker, a tool where you can search for a set and pull up data to build and print a label on half sheet Avery labels

### v2.1.0

- Added button to Quote Builder table rows where you can take the set immediately to a label in Label Maker
- Added redux to Label Maker, so refreshing page doesn't wipe you out

### v2.1.1

- Fixed bug where Tooltip Confirmation Modal wasn't allowing you to click on the button, preventing users from deleting things that interact with state/redux

### v2.1.2

- Fixed bug with Tooltip Confirmation Modal where you could just mouse enter into the button, and it would delete on desktop.  Now you have to click on it

### v3.0.0

- Added Part Collector, a tool where you can search for a set and pull up all pieces for it, then add certain pieces to the database
  - This allows for you to see a table/grid view of multiple pieces that you need for different projects
  - Consists of two screens, the Add Parts screen and the View Parts screen
- Fixed the BrickEconomy fallback service for when piece/minifig counts don't exist on Brickset
  - When you had a set without minifigs, and there's no piece data on Brickset, BrickEconomy couldn't find the piece count, since it was looking for "Pieces / Minifigs", when we really should have been looking for "Pieces"

