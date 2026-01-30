const Cart = require("../models/cart");

exports.fetchCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart data fetched successfully",
      data: cart.products,
    });
  } catch (error) {
  console.error("Cart Fetch Error:", error);
  res.status(500).json({
    success: false,
    message: error.message
  });
}
};
