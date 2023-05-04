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
router.post("/menu", upload.single("image"), async (req: any, res: any) => {
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
