import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
require("dotenv").config();
import jwt from "jsonwebtoken";
import {User, Admin} from "../Model/Auth";
import {userValidation, adminValidation, Loginadmin} from "../validate/schemas";

// Route to handle user and admin registration requests
router.post("/register", async (req: any, res: any) => {
  // Validate the request body for user registration
  const {error: userError} = userValidation(req.body);
  if (userError) {
    return res.status(404).json({message: userError.details[0].message});
  }

  // Validate the request body for admin registration
  const {error: adminError} = adminValidation(req.body);
  if (adminError) {
    return res.status(407).json({message: adminError.details[0].message});
  }

  const {firstName, email, password, role} = req.body;

  try {
    // Check if the email already exists in the appropriate collection
    if (role === "user") {
      const existingUser = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({message: "Email already exists"});
      }
    } else if (role === "admin") {
      const existingAdmin = await Admin.findOne({email});
      if (existingAdmin) {
        return res.status(400).json({message: "Email already exists"});
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new document in the appropriate collection
    if (role === "user") {
      const newUser = new User({
        firstName,

        email,
        password: hashedPassword,
        role: "user", // Make sure to set the role explicitly
      });
      await newUser.save();
    } else if (role === "admin") {
      const newAdmin = new Admin({
        firstName,

        email,
        password: hashedPassword,
        role: "admin", // Make sure to set the role explicitly
      });
      await newAdmin.save();
    }

    res.status(201).json({
      message: "Registration successful",
      user: {
        firstName,

        email,
        role,
      },
    });
  } catch (err: any) {
    // Send an error response to the client
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  // Validate the request body for login
  const {error} = Loginadmin(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  const {email, password} = req.body;

  try {
    // Find the user or admin based on the email
    let user = await User.findOne({email});
    let isAdmin = false;

    // Check if the user exists
    if (!user) {
      // If user not found, check if admin exists
      user = await Admin.findOne({email});
      isAdmin = true;
    }

    // Check if the user or admin exists
    if (!user) {
      return res.status(407).json({
        message: `
        the email ${email}
        does not exist`,
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    // Create a JWT token
    const role = isAdmin ? "admin" : "user";
    const token = jwt.sign({userId: user._id, role}, "your-secret-key", {
      expiresIn: "1h",
    });

    // Return the token to the client
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,

        email: user.email,
      },
      isAdmin,
    });
  } catch (err: any) {
    // Send an error response to the client
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Middleware to extract the token from the request headers
const extractToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    req.token = token;
  }
  next();
};

// Middleware to verify the token and attach the user to the request object
const verifyToken = (req: any, res: any, next: any) => {
  try {
    const verified = jwt.verify(req.token, "your-secret-key") as any;
    console.log(verified); // Log the verified object
    req.user = verified.userId; // Assign the userId directly
    next();
  } catch (err) {
    res.status(401).json({message: "Invalid token"});
  }
};
// Route handler to get user and admin info based on the token

router.get("/me", extractToken, verifyToken, async (req: any, res: any) => {
  try {
    // Find the user or admin based on the user id
    const user = await User.findById(req.user);
    const admin = await Admin.findById(req.user);
    if (user) {
      return res.status(200).json({
        user: {
          _id: user._id,
          firstName: user.firstName,

          email: user.email,
        },
        isAdmin: false,
      });
    } else if (admin) {
      return res.status(200).json({
        user: {
          _id: admin._id,

          firstName: admin.firstName,

          email: admin.email,
        },
        isAdmin: true,
      });
    } else {
      return res.status(404).json({message: "User not found"});
    }
  } catch (err: any) {
    // Send an error response to the client
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

//logout
router.post("/logout", extractToken, verifyToken, (req, res) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "console.log(authHeader);");
  if (!authHeader) {
    return res.status(401).json({message: "Unauthorized"});
  }
  const token = authHeader.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({message: "Unauthorized"});
  }
  res.status(200).json({message: "Logout successful"});
});



  



  








export default router;
