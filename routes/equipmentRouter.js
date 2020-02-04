const router = require("express").Router();
const {
  addEquipment,
  getEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
} = require("../helpers/equipmentModel");
const {
  restrictToRenters,
  restrictToOwners,
  restrictToPoster
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

router.put("/:id", (req, res, next) => {
  updateEquipment(req.body, req.params.id)
    .then(updatedEquipment => {
      res.status(200).json(updatedEquipment);
    })
    .catch(error => {
      res.status(400).json({
        errorMessage: `Unable to make changes to this equipment at this time`
      });
    });
});

router.delete("/:id", (req, res, next) => {
  deleteEquipment(req.body, req.params.id)
    .then(deletedEquipment => {
      res.status(204).json(deletedEquipment);
    })
    .catch(error => {
      res
        .status(400)
        .json({ errorMessage: `Unable to delete equipment at this time` });
    });
});

module.exports = router;
