const Order = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new order
exports.createOrder = async (req, res) => {
  const { products } = req.body;

  try {
    // Calculate the total price of the order
    const totalPrice = products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    // Create a new order in the database
    const order = await Order.create({ products });

    // Create a Stripe session for payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100, // Stripe expects the amount in cents
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:4000/', // Replace with your success URL
      cancel_url: 'http://localhost:4000/', // Replace with your cancel URL
    });

    res.json({ success: true, orderId: order._id, totalPrice, sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
