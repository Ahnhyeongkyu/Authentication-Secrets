require("dotenv").config();

const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
    bodyparser.urlencoded({
        extended: true,
    })
);

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(
        "mongodb://0.0.0.0:27017/userDB"
        //local server adress
        // mongodb://0.0.0.0:27017
    );
    console.log("Server connect");
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = process.env.SECRET; 

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });

    newUser
        .save()
        .then((result) => {
            res.render("secrets");
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
