import express from "express";
import {Category, Menu} from "../Model/Category";
import {menuValidation, categoryValidation} from "../validate/schemas";
const router = express.Router();

// // Get all menu items
// router.get('/menu', async (req: any, res:any) => {
//   try {
//     const menuItems = await Menu.find().populate('category');
//     res.json(menuItems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving menu items.');
//   }
// });

// // Get menu items by category
// router.get("/menu/:categoryId", async (req, res) => {
//   const {categoryId} = req.params;

//   try {
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).send("Category not found");
//     }
//     const menuItems = await Menu.find({category: categoryId}).populate(
//       "category"
//     );
//     res.json(menuItems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving menu items.");
//   }
// });

// // Add a new menu item
// router.post("/menu", async (req:any , res:any) => {
//   const {name, description, category, price, image} = req.body;

//   try {
//     let menuItem = await Menu.create({
//       name,
//       description,
//       category,
//       price,
//       image,
//     });

//     // find the category document by name
//     let categoryDoc = await Category.findOne({name: category});

//     if (!categoryDoc) {
//       // if category doesn't exist, create a new one
//       categoryDoc = await Category.create({
//         name: category,
//         description: `${category} items`,
//         items: [menuItem._id],
//       });
//     } else {
//       // check if the category already has the menu item
//       const itemExists = categoryDoc.items.find(
//         (item) => item.toString() === menuItem._id.toString()
//       );
//       if (itemExists) {
//         return res.status(400).send("Menu item already exists in this category.");
//       }
//       // add the menu item to the category
//       categoryDoc.items.push(menuItem._id);
//       await categoryDoc.save();
//     }

//     res.status(201).json(menuItem);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error adding menu item.",
//       error,
//     })
//   }
// });

// // Create category endpoint
// router.post("/categories", async (req, res) => {
//   try {
//     const {name, description} = req.body;

//     const existingCategory = await Category.findOne({name});
//     if (existingCategory) {
//       return res.status(409).json({message: "Category already exists"});
//     }

//     const newCategory = await Category.create({name, description});
//     res.status(201).json(newCategory);
//     console.log(newCategory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error creating category.",
//     });
//   }
// });

// // get the category
// router.get("/categories", async (req, res) => {
//   try {
//     const categories = await Category.find().populate("items");
//     res.json(categories);
//     console.log(
//       "🚀 ~ file: menu.ts ~ line 127 ~ router.get ~ categories",
//       categories
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving categories.");
//   }
// });

// Create a new menu item and a new category
router.post("/menu", async (req, res) => {
  try {
    const {error, value} = menuValidation(req.body);
    if (error) {
      return res.status(400).json({error: error.details[0].message});
    }

    const menu = new Menu(value);
    const savedMenu = await menu.save();

    res.status(201).json({
      message: "Menu item created successfully",
      menu: savedMenu,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating menu item.",
      error: err,
    });
  }
});

// Get all menu items
router.get("/menu", async (req: any, res: any) => {
  try {
    const menuItems = await Menu.find().populate("category");
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving menu items.");
  }
});

// Get menu items by category
router.get("/menu/:categoryId", async (req: any, res: any) => {
  const {categoryId} = req.params;
  const categoryDoc = await Category.findById(categoryId);
  if (!categoryDoc) {
    return res.status(404).send("Category not found");
  }

  try {
    const menuItems = await Menu.find({category: categoryId}).populate(
      "category"
    );
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving menu items.");
  }
});

// get the category
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving categories.",
      error: error,
    });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const {error, value} = categoryValidation(req.body);
    if (error) {
      return res.status(400).json({error: error.details[0].message});
    }

    // Check if the category already exists
    const category = await Category.findOne({_id: value.id});
    if (category) {
      return res.status(400).json({message: "Category already exists"});
    }

    const newCategory = new Category(value);
    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating category.",
      error: err,
    });
  }
});










// // Create default caegories
//   const defaultCategories = [
//     { name: 'Appetizers', description: 'Start your meal with these delicious bites', isDefault: true },
//     { name: 'Entrees', description: 'The main course of your meal', isDefault: true },
//     { name: 'Desserts', description: 'Indulge your sweet tooth with our desserts', isDefault: true },
//   ];

// try {
//   defaultCategories.forEach(async (category) => {
//     const categoryDoc = await Category.create(category);
//     console.log(`${categoryDoc.name} category created`);
//   });
// } catch (error) {
//   console.error(error);
// }





export default router;
