const { getAccountTypeWithId } = require("../helpers/authModel");
const { getOwnerIdByEquipmentId } = require("../helpers/equipmentModel");
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
          req.decoded = decoded;
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
          req.decoded = decoded;
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

async function restrictToPoster(req, res, next) {
  const id = req.params.id;
  const { user_id } = await getOwnerIdByEquipmentId(id);
  if (req.decoded.subject === user_id) {
    next();
  } else {
    res
      .status(400)
      .json({ message: `You cannot make changes to this equipment` });
  }
}

module.exports = {
  restrictToOwners,
  restrictToRenters,
  restrictToPoster
};
