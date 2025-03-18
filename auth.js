const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

 
    user = new User({ name, email, password });


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);


    await user.save();
    res.json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error during signup" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", 
          sameSite: "strict",
          maxAge: 3600000, 
        });
        res.json({ msg: "Login successful" });
      }
    );

    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login" });
  }
});

module.exports = router;
