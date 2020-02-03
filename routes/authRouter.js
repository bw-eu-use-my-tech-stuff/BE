const {
  addUser,
  getUserById,
  getUsers,
  findUser
} = require("../helpers/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password, account_type } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 11);
  addUser({ username, password: hashedPassword, account_type })
    .then(user => {
      res.status(201).json({ id: user.id, username: user.username });
    })
    .catch(error => {
      res.status(400).json({
        errorMessage: `Unable to register new user at this time. ${error.message}`
      });
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
        errorMessage: `Cannot login at this time. Please try again. ${error.message}`
      });
    });
});

// router.get("/users", restricted, (req, res, next) => {
//   Users.getUsers()
//     .then(users => {
//       if (users) {
//         res
//           .status(200)
//           .json(users.map(user => ({ id: user.id, username: user.username })));
//       } else {
//         next({ message: "No users were found", status: 404 });
//       }
//     })
//     .catch(next);
// });

// router.get("/users/:id", restricted, validateUserId, (req, res) => {
//   res.status(200).json(req.user);
// });

// router.put("/users/:id", validateUserId, validateUserBody, (req, res, next) => {
//   Users.update(req.body, req.user.id)
//     .then(updatedScheme => {
//       res.status(200).json(updatedScheme);
//     })
//     .catch(next);
// });
//
// router.delete("/users/:id", validateUserId, (req, res, next) => {
//   Users.remove(req.user.id)
//     .then(() => {
//       res.status(204).json(req.user);
//     })
//     .catch(next);
// });

// router.use((error, req, res, next) => {
//   res
//     .status(error.status || 500)
//     .json({
//       file: "user-router",
//       //headers: req.headers,
//       //protocol: req.protocol,
//       method: req.method,
//       url: req.url,
//       status: error.status || 500,
//       message: error.message
//     })
//     .end();
// });

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
