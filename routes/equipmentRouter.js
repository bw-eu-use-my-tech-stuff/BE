const router = require("express").Router();
const {
  addEquipment,
  getEquipments,
  getEquipmentById
} = require("../helpers/equipmentModel");
const {
  restrictToRenters,
  restrictToOwners
} = require("../middleware/restricted");

router.get("/", (req, res) => {
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

router.post("/", restrictToOwners, (req, res) => {
  const { name, category, cost, description } = req.body;
  const newEquipment = {
    name,
    category,
    cost,
    description,
    user_id: req.decoded.subject
  };
  addEquipment(newEquipment)
    .then(equipment => {
      res.status(201).json(equipment);
    })
    .catch(error => {
      res
        .status(400)
        .json({ errorMessage: `Unable to add a new equipment at this moment` });
    });
});

module.exports = router;
