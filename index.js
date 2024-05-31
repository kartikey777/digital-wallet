const express = require('express');
const app = express();
const doenv = require('dotenv');
const cors = require("cors");

doenv.config();
app.use(express.json());
app.use(cors());

app.get("/" , (req, res) => {
    return res.send("api is running ")
})
 
// local folder
const connectDB = require('./config/connectDB');
const authRouter = require('./routes/auth/auth');
const paymentRouter = require("./routes/payment/payment.route");

connectDB();
app.use('/auth', authRouter);
app.use('/payment' , paymentRouter)

app.listen(8000);