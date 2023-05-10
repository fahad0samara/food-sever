import express, {Request, Response} from "express";
import {User} from "../Model/Auth";
import {Menu} from "../Model/Category";
import {Cart, CartItem} from "../Model/Cart";
const router = express.Router();

router.post("/add", async (req, res) => {
  const {userId, itemId, quantity} = req.body;

  try {
    // Find user and menu item
    const user = await User.findById(userId);
    const menuItem = await Menu.findById(itemId);

    // Check if user and menu item exist
    if (!user || !menuItem) {
      return res.status(404).json({message: "User or menu item not found"});
    }

    // Find user's cart or create new cart if it doesn't exist
    let cart = await Cart.findOne({user: user._id});
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [],
      });
    }

    // Find index of item in cart
    const itemIndex = cart.items.findIndex(
      item => item.item.toString() === itemId.toString()
    );
    console.log("Item index:", itemIndex);

    // If item already exists in cart, update its quantity
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Otherwise, add new item to cart
      const cartItem = new CartItem({
        item: menuItem._id,
        quantity,
      });
      cart.items.push(cartItem);
    }

    // Save cart to database
    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.get("/cart/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find user's cart
    const cart = await Cart.findOne({user: userId}).populate({
      path: "items.item",
      model: "Menu",
    });

    if (!cart) {
      return res.status(404).json({message: "Cart not found"});
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
});

export default router;
