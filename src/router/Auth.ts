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
    return res.status(400).json({message: userError.details[0].message});
  }

  // Validate the request body for admin registration
  const {error: adminError} = adminValidation(req.body);
  if (adminError) {
    return res.status(400).json({message: adminError.details[0].message});
  }

  const {firstName, lastName, email, password, role} = req.body;

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
        lastName,
        email,
        password: hashedPassword,
        role: "user", // Make sure to set the role explicitly
      });
      await newUser.save();
    } else if (role === "admin") {
      const newAdmin = new Admin({
        firstName,
        lastName,
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
        lastName,
        email,
        role,
      },
    });
  } catch (err) {
    // Send an error response to the client
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
      err,
    });
  }
});

//Route to handle user and admin login
// router.post("/login", async (req, res) => {
//   // Validate the request body for user login
//   const {error} = Loginadmin(req.body);
//   if (error) {
//     return res.status(400).json({message: error.details[0].message});
//   }

//   const {email, password, role} = req.body;

//   try {
//     // Find the user or admin based on the email and
//     let user;
//     if (role === "user") {
//       user = await User.findOne({email});
//     } else if (role === "admin") {
//       user = await Admin.findOne({email});
//     }

//     // Check if the user exists
//     if (!user) {
//       return res.status(400).json({message: "Invalid email or password"});
//     }

//     // Check if the password is correct
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({message: "Invalid email or password"});
//     }

//     // Create a JWT token
//     const token = jwt.sign({userId: user._id, role}, "sdgsdgsdgsg", {
//       expiresIn: "1h",
//     });

//     // Return the token to the client
//     res.status(200).json({token});
//   } catch (err) {
//     // Send an error response to the client
//     console.error(err);
//     res.status(500).json({message: "Internal server error"});
//   }
// });

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
      return res.status(400).json({
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      isAdmin:
        role === "admin" ? true : false /* Send isAdmin flag to the client */,
    });
  } catch (err) {
    // Send an error response to the client
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
});

export default router;
