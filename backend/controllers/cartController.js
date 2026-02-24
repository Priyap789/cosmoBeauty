const Cart = require("../models/Cart");

/* ================= ADD TO CART ================= */
const addToCart = async (req, res) => {
  const { userId, productId, quantity, price } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET USER CART ================= */
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE CART ITEM ================= */
const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // If quantity becomes 0 → remove item
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.status(200).json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= REMOVE ITEM ================= */
const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.status(200).json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
};
