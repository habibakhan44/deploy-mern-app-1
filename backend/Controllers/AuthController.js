const UserModel = require("../Models/Users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        // 👇 Yeh line add karo — yeh console pe dikha dega kya data aya hai Postman se
        console.log("BODY RECEIVED =>", req.body);

        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ 
                message: 'User already exists, you can login', 
                success: false 
            });
        }

        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        res.status(201).json({
            message: "Signup successfully",
            success: true
        });

    } catch (err) {
        // 🔍 Yeh line error ko clearly console mein dikhayegi
        console.error("SIGNUP ERROR:", err);

        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        console.log("LOGIN BODY RECEIVED =>", req.body);

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password',
                success: false
            });
        }

        // 🔐 JWT Token banana
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET ,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            success: true
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};











module.exports = {
    signup,
    login
};
