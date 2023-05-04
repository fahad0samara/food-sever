import express from "express";
import {Category, Menu} from "../Model/Category";
import {menuValidation, categoryValidation} from "../validate/schemas";
const router = express.Router();

// const {BlobServiceClient} = require("@azure/storage-blob");
// const uuid = require("uuid");
// const multer = require("multer");




// // configure Azure Blob Storage
// const blobServiceClient = BlobServiceClient.fromConnectionString(
//   "DefaultEndpointsProtocol=https;AccountName=fahadtorg;AccountKey=fEMmu2yIHwvFS6fXIIQ0Wc+aF8jcMD+BVsIOVk1ngzunUei15auf3xxiVcNej1dA3jBDf2PxMUpu+AStXiZhdg==;EndpointSuffix=core.windows.net"
// );
// const containerName = "menu-items"; // set the container name
// const containerClient = blobServiceClient.getContainerClient(containerName);

// // create the container if it does not exist
// const createContainerIfNotExists = async () => {
//   const containerExists = await containerClient.exists();
//   if (!containerExists) {
//     await containerClient.create();
//     console.log(`The container "${containerName}" has been created`);
//   }
// };
// createContainerIfNotExists();

// // configure Multer to use Azure Blob Storage as the storage engine
// const storage = multer.memoryStorage();
// const upload = multer({storage: storage});

// // define a route to handle file uploads
// router.post("/menu", upload.single("image"), async (req:any, res) => {
//   try {
//     // get the file info from the request
//     const file = req.file;

//     // generate a unique filename for the file
//     const filename = `${uuid.v4()}.${file.originalname.split(".").pop()}`;

//     // create a new block blob with the generated filename
//     const blockBlobClient = containerClient.getBlockBlobClient(filename);

//     // upload the file to Azure Blob Storage
//     await blockBlobClient.upload(file.buffer, file.buffer.length);

//     // create a new menu item with the file URL returned by Azure Blob Storage
//     const newItem = {
//       name: req.body.name,
//       description: req.body.description,
//       category: req.body.category,
//       price: req.body.price,
//       image: blockBlobClient.url,
//     };

//     // send the saved item as the response
//     res.json(newItem);
//     console.log(
//       `File uploaded successfully. ${blockBlobClient.url} ${req.body.name}`

//     );
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: "Server error"});
//   }
// });
// const {BlobServiceClient} = require("@azure/storage-blob");
// const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({storage});

// const AZURE_STORAGE_CONNECTION_STRING =
//   "DefaultEndpointsProtocol=https;AccountName=fahadtorg;AccountKey=fEMmu2yIHwvFS6fXIIQ0Wc+aF8jcMD+BVsIOVk1ngzunUei15auf3xxiVcNej1dA3jBDf2PxMUpu+AStXiZhdg==;EndpointSuffix=core.windows.net";
// const AZURE_STORAGE_CONTAINER_NAME = "fahadtorg";

// const blobServiceClient = BlobServiceClient.fromConnectionString(
//   AZURE_STORAGE_CONNECTION_STRING
// );
// const containerClient = blobServiceClient.getContainerClient(
//   AZURE_STORAGE_CONTAINER_NAME
// );

// router.post("/menu", upload.single("image"), async (req: any, res) => {
//   console.log(req.file);
//   try {
//     const {error, value} = menuValidation(req.body);
//     if (error) {
//       return res.status(400).json({error: error.details[0].message});
//     }

//     // Check if the container exists
//     const containerExists = await containerClient.exists();
//     if (!containerExists) {
//       // Create the container if it doesn't exist
//       await containerClient.create();
//       console.log(
//         `Container "${AZURE_STORAGE_CONTAINER_NAME}" created successfully.`
//       );
//     }

//     // Upload the file to the container
//     const blobName = `${Date.now()}-${req.file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     const uploadOptions = {
//       blobHTTPHeaders: {
//         blobContentType: req.file.mimetype,
//       },
//       metadata: {
//         originalName: req.file.originalname,
//       },
//     };
//     const uploadResponse = await blockBlobClient.upload(
//       req.file.buffer,
//       req.file.size,
//       uploadOptions
//     );

//     console.log(
//       `File "${blobName}" uploaded successfully. ETag: ${uploadResponse.etag}, Last Modified: ${uploadResponse.lastModified}`
//     );

//     // Save the image URL in the database
//     const menuItem = new Menu({
//       ...value,
//       image: blockBlobClient.url,
//     });

//     const createdDate = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//     menuItem.isNew = createdDate > thirtyDaysAgo;
//     await menuItem.save();

//     res.status(201).json(menuItem);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error adding menu item.",
//       error,
//     });
//   }
// });

const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");

// configure Cloudinary
cloudinary.config({
  cloud_name: "dh5w04awz",
  api_key: "154856233692976",
  api_secret: "sD9lI3ztLqo62It9mEias2Cqock",
});

// configure Multer to use Cloudinary as the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "menu-items", // set the folder name
  allowedFormats: ["jpg", "png", "jpeg"], // specify the allowed file formats
  transformation: [{width: 500, height: 500, crop: "limit"}], // specify any image transformations
});

// create a Multer instance with the configured storage engine
const upload = multer({storage: storage});

// define a route to handle file uploads
router.post("/menu", upload.single("image"), async (req:any, res:any) => {
  try {
    // get the file info from the request
    const file = req.file;

    // create a new menu item with the file URL returned by Cloudinary
    const newItem = new Menu({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      image: file.path,
    });

    // save the new menu item to the database
    const savedItem = await newItem.save();

    // send the saved item as the response
    res.json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Server error"});
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

// Get all menu items

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
