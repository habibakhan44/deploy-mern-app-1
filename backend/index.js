const express = require('express');
const app = express();
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');


require('dotenv').config();           // 🌱 Load .env variables
require('./Models/db');               // 🔌 Connect to MongoDB
const PORT = process.env.PORT || 8080;

// ✅ Middlewares (always before routes)
app.use(express.json());              // Parses incoming JSON
app.use(cors());                      //Enables Cross-Origin requests

app.get('/ping', (req, res) => {
    res.send("PONG");
});
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
