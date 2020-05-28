# Marketplace Back-End

### Instructions

#### Setting up the project:

1. Start the MongoDB shell.

2. Install the dependencies by:

   ```bash
   npm install
   ```

4. Start the API:

   ```bash
   npm start
   ```


#### Using the API:

The API have 6 endpoints:

```bash
Non-Authenticated

// Create a new user
	POST: /auth/register
// Login an user
	POST :/auth/login
// Add new product
	POST: /product
// Get all products
	GET: /product
// Get product by id
	GET: /product/:id

Authenticated: Bearer token
// Get user shopcart
	GET: /user/shopcart
// Add product to user shopcart
	PUT: /user/shopcart/add/:productId
// Remove product from user shopcart
	PUT: /user/shopcart/remove/:productId

NOTE: All POST requests must be sent using x-www-form-urlencoded.
```



