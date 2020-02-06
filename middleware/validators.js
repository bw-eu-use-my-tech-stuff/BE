const { getEquipmentById } = require("../helpers/equipmentModel");

function validateEquipmentId(req, res, next) {
  const { id } = req.params;
  let validId = Number(id);
  if (!Number.isInteger(validId) && validId > 0) {
    res.status(400).json({ message: `The id provided is invalid` });
  }
  getEquipmentById(validId)
    .then(equipment => {
      if (equipment) {
        next();
      } else {
        res
          .status(400)
          .json({ message: `Equipment with ID:${validId} does not exist` });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: `Internal server error. Please try again` });
    });
}

function validateEquipmentBody(req, res, next) {
  const { name, category, cost, description } = req.body;
  if (name && category && cost && description) {
    next();
  } else {
    res.status(400).json({
      message: `Please provide name, category, cost and description to your request`
    });
  }
}

module.exports = {
  validateEquipmentId,
  validateEquipmentBody
};
