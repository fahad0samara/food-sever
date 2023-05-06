import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import {User, Admin} from "../Model/Auth";

// Route to handle user and admin registration requests
router.post("/register", async (req: any, res: any) => {
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

    // Send a success response to the client
    res.status(201).json({message: "Registration successful"});
  } catch (err) {
    // Send an error response to the client
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
});

export default router;
