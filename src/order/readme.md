# Summary

The order module handle the ordering and payment flow. THis handle the various order and their status.

# Endpoints

The endpoint available are:
- POST /orders - Create order from cart
- GET /orders - Get all user orders
- GET /orders/summaries - Get order summaries
- GET /orders/:id - Get specific order
- PATCH /orders/:id/status - Update order status (admin)
- PATCH /orders/:id/cancel - Cancel order
- GET /orders/admin/all - Get all orders (admin)