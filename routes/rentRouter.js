const {
  addRent,
  getRentDetails,
  getRentDetailsById
} = require("../helpers/rentDetailsModel");
const { restrictToRenters } = require("../middleware/restricted");
const { avoidDuplicateRent } = require("../middleware/rent");
const {
  validateEquipmentId,
  validateRentBody
} = require("../middleware/validators");
const express = require("express");

const router = express.Router();

router.post(
  "/:equipment_id",
  validateEquipmentId,
  validateRentBody,
  avoidDuplicateRent,
  restrictToRenters,
  (req, res) => {
    const newRent = {
      ...req.body,
      user_id: req.decoded.subject
    };
    addRent(newRent, req.params.equipment_id)
      .then(createdRent => {
        res.status(201).json(createdRent);
      })
      .catch(error => {
        res
          .status(400)
          .json({ errorMessage: `Unable to add a rent ${error.message}` });
      });
  }
);

router.get("/", restrictToRenters, (req, res) => {
  getRentDetails()
    .then(rentals => {
      const userRentals = rentals.filter(
        rent => rent.user_id === req.decoded.subject
      );
      res.status(200).json(userRentals);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: `Unable to retrieve your rentals at this moment`
      });
    });
});

// router.get("/:id", restrictToRenters, (req, res) => {
//   getRentDetailsById(req.params.id)
//     .then(rental => {
//       if (rental.user_id === req.decoded.subject) {
//         res.status(200).json(rental);
//       } else {
//         res.status(400).json({
//           errorMessage: `Unable to retrieve rental. Rental ID:${req.params.id} belongs to another User`
//         });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({
//         errorMessage: `Unable to retrieve rental with ID:${req.params.id} at this moment ${error.message}`
//       });
//     });
// });

module.exports = router;
