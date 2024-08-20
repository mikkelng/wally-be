const express = require("express");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const User = require("../models/User.model");
const { isAuthenticated } = require("./../middlewares/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup
router.post("/signup", async (req, res, next) => {
    console.log("Signup route hit");
    const { email, password, name } = req.body;
    try {
        if (email === "" || password === "" || name === "") {
        res.status(400).json({ message: "Provide email, name, password" });
        return;
        }
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (emailRegex.test(email) === false) {
        res.status(400).json({ message: "Provide a valid email address" });
        return;
        }

        const foundUser = await User.findOne({ email: email });

        if (foundUser) {
        res.status(400).json({ message: "User already exists" });
        return;
        }

    
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

   
        const createdUser = await User.create({
        email: email,
        password: hashedPassword,
        name: name,
        });

     
        const { email: userEmail, name: userName, _id } = createdUser;
        const user = { email: userEmail, name: userName, _id: _id };

      
        res.status(201).json(user);
    } catch (error) {
        next(err);
    }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password" });
        return;
        }

    
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
        res.status(401).json({ message: "User not found" });
        return;
        }
        const passwordCorrect = await bcrypt.compare(password, foundUser.password);

        if (passwordCorrect) {
        const { email, name, _id } = foundUser;

        const user = { email, name, _id };

        const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
        } else {
        res.status(400).json({ message: "Unable to authorize the user" });
        }
    } catch (error) {
        res.status(500).json(error)
    }
});

// GET /auth/verify - Used to verify the JWT stored on the client is valid
router.get("/verify", isAuthenticated, (req, res, next) => {
// The middleware will verify if the token  exists and if it is valid

// If so we just return back a response with the payload (user data)
res.status(200).json(req.payload);
});

module.exports = router;