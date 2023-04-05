const express = require("express")
const app = express()
const mongoose = require("mongoose")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const connectDB = require("./config/database")
const logger = require("morgan")
const cors = require("cors")

const authRoutes = require('./routes/auth')

require("dotenv").config({ path: "./config/.env" });

connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
)

app.use(cookieParser("keyboardcat"))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Routes // 
app.use('/auth', authRoutes)


app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`))