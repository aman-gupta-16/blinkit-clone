const MESSAGES = {
  // Auth
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',

  // Token
  NO_TOKEN: 'No token provided, authorization denied',
  INVALID_TOKEN: 'Token is invalid or expired',

  // Access
  NOT_AUTHORIZED: 'Not authorized to access this resource',
  ADMIN_ONLY: 'Access denied. Admins only.',

  // Product
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',

  // Cart
  CART_ITEM_ADDED: 'Item added to cart',
  CART_ITEM_UPDATED: 'Cart item updated',
  CART_ITEM_REMOVED: 'Item removed from cart',
  CART_CLEARED: 'Cart cleared',
  CART_ITEM_NOT_FOUND: 'Cart item not found',

  // Generic
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
};

module.exports = MESSAGES;
