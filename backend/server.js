require("dotenv").config({ path: "./config/.env" });

const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const logger = require("morgan")
const connectDB = require("./config/database")

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user')

app.use(cors())

require("./config/passport")(passport)
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
    })
)
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Routes // 
app.use('/auth', authRoutes)
app.use('/post', postRoutes)
app.use('/user', userRoutes)


app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`))