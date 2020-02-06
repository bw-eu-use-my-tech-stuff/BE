const { isEquipmentAvailable } = require("../helpers/equipmentModel");

async function avoidDuplicateRent(req, res, next) {
  const available = await isEquipmentAvailable(req.params.equipment_id);
  if (available == false) {
    res.status(400).json({ message: `This equipment has been rented already` });
  } else {
    next();
  }
}

module.exports = {
  avoidDuplicateRent
};
