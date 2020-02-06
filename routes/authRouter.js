const { addUser, findUser } = require("../helpers/authModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password, account_type } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 11);
  findUser({ username }).then(user => {
    if (!user) {
      addUser({ username, password: hashedPassword, account_type })
        .then(user => {
          res.status(201).json({ id: user.id, username: user.username });
        })
        .catch(error => {
          res.status(400).json({
            errorMessage: `Unable to register new user at this time.`
          });
        });
    } else {
      res.status(400).json({
        errorMessage: `Username already exists. Please try another username`
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  findUser({ username })
    .then(user => {
      if (!user) {
        res
          .status(400)
          .json({ message: `Username not found. Please check your username` });
      } else {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
          res.status(400).json({
            message: `Password is incorrect. Please check your password`
          });
        } else {
          const token = generateToken(user);
          res.status(200).json({ token });
        }
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: `Cannot login at this time. Please try again.`
      });
    });
});

function generateToken(user) {
  return jwt.sign(
    {
      subject: user.id,
      username: user.username
    },
    process.env.JWT_SECRET || "as$q87sRwqQ!wPbc76@=C5%TX+dwR5&$",
    {
      expiresIn: "30d"
    }
  );
}

module.exports = router;
