/**
 * Convert price string to number
 * @param {string} price - Price string (e.g., "$14.99")
 * @returns {number} - Numeric price
 */
const parsePriceString = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
};

/**
 * Calculate the total price of items in the cart
 * @param {Array} items - Array of items with price and quantity
 * @returns {number} - Total price
 */
export const calculateTotalPrice = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    const price = parsePriceString(item.price);
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);
};

/**
 * Format price to currency string
 * @param {number|string} price - Price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  const numericPrice = parsePriceString(price);
  return `${currency}${numericPrice.toFixed(2)}`;
};

/**
 * Calculate subtotal, tax, and total for an order
 * @param {Array} items - Array of items with price and quantity
 * @param {number} taxRate - Tax rate as decimal (default: 0.1 for 10%)
 * @returns {Object} - Object containing subtotal, tax, and total
 */
export const calculateOrderTotals = (items, taxRate = 0.1) => {
  const subtotal = calculateTotalPrice(items);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
    formattedSubtotal: formatPrice(subtotal),
    formattedTax: formatPrice(tax),
    formattedTotal: formatPrice(total)
  };
}; 