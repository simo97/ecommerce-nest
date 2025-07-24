# Summary

This module handle the ability to manage the user's cart. It works as following: A user only have one cart, which can be emptied, receive item and allow item removal. A cart once created belong to a user, when adding to the cart if it does not exist, simply create one for the user. In the case the user is not logged in, we use a temporary session token (which will be saved in the user's computer)

# Endpoints:

- POST /cart/add - Add a product to the cart
- DELETE /cart/remove/<:id> - remove a specific item from the cart
- GET /cart - see the content of the cart
- DELETE /cart/empty -  remove everything from the cart
- GET /cart/summary - get a summary like the total number of item, the total value (price)
- PATCH /cart/:id/update - update a item count already present in the cart