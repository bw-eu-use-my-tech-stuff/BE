const { getEquipmentById } = require("../helpers/equipmentModel");

function validateEquipmentId(req, res, next) {
  const { id, equipment_id } = req.params;
  const validId =
    equipment_id === undefined ? Number(id) : Number(equipment_id);
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

function validateRentBody(req, res, next) {
  const { start_time, duration } = req.body;
  if (start_time && duration) {
    next();
  } else {
    res.status(400).json({
      message: `Please provide start_time and duration`
    });
  }
}

module.exports = {
  validateEquipmentId,
  validateEquipmentBody,
  validateRentBody
};
