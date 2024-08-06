const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/createuser", async (req, res) => {
  const { name, email, password, age } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, result) => {
      const user = await userModel.create({
        name,
        email,
        password: result,
        age,
      });
      const token = jwt.sign({ email }, "topsecret");
      res.cookie("token", token);
      res.send(user);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) res.send("invalid cridentials!");
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign({ email }, "topsecret");
      res.cookie("token", token);
      res.send("you are logged in :)");
    }else{
        res.send("invalid cridentials!");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(3000);
