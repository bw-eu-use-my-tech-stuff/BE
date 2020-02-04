const router = require("express").Router();
const {
  addEquipment,
  getEquipments,
  getEquipmentById
} = require("../helpers/equipmentModel");
const { restrictToRenters } = require("../middleware/restricted");

router.get("/", restrictToRenters, (req, res) => {
  getEquipments()
    .then(equipments => {
      res.status(200).json(equipments);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: `Unable to retrieve equipments at this time` });
    });
});

module.exports = router;
