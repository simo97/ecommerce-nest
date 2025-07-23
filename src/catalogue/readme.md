# Summary

This module handle the products viewed from the end user standpoint.

# Routes

Base route `/catalogue`

- /products : list available products
- /category
- /search?query=<string>&price=<int>&category

# Service methods

- List Product : this will return all the product that have a number of item available that has a count greather than 0
- List category: this will return all the categories available (isAvailabe=True)
- Search : this will be used as a filter / search endpoint to et the user explore the store