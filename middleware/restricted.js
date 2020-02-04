const { getAccountTypeWithId } = require("../helpers/authModel");
const jwt = require("jsonwebtoken");

function restrictToOwners(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "as$q87sRwqQ!wPbc76@=C5%TX+dwR5&$",
      async (err, decoded) => {
        if (err) {
          res.status(400).json({
            message: `Your token is unauthorized. Please check and try again`
          });
        } else {
          const { account_type } = await getAccountTypeWithId(decoded.subject);
          if (account_type === "owner") {
            next();
          } else {
            res.status(400).json({
              message: "Invalid account type. Use a owner account"
            });
          }
        }
      }
    );
  } else {
    res.status(400).json({ message: `No token provided. You shall not pass` });
  }
}

function restrictToRenters(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "as$q87sRwqQ!wPbc76@=C5%TX+dwR5&$",
      async (err, decoded) => {
        if (err) {
          res.status(400).json({
            message: `Your token is unauthorized. Please check and try again`
          });
        } else {
          const { account_type } = await getAccountTypeWithId(decoded.subject);
          if (account_type === "renter") {
            next();
          } else {
            res.status(400).json({
              message: "Invalid account type. Use a renter account"
            });
          }
        }
      }
    );
  } else {
    res.status(400).json({ message: `No token provided. You shall not pass` });
  }
}

module.exports = {
  restrictToOwners,
  restrictToRenters
};
