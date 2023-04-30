import express from "express";
import {Category, Menu} from "../Model/Category";

const router = express.Router();

// Get menu items by category
router.get("/menu/:categoryId", async (req, res) => {
  const {categoryId} = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    const menuItems = await Menu.find({category: categoryId}).populate(
      "category"
    );
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving menu items.");
  }
});

// Add a new menu item
router.post("/menu", async (req, res) => {
  const {name, description, category, price, image} = req.body;

  try {
    const newMenuItem = await Menu.create({
      name,
      description,
      category,
      price,
      image,
    });
    const updatedCategory = await Category.findByIdAndUpdate(category, {
      $push: {items: newMenuItem._id},
    });
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating menu item.");
  }
});

export default router;
