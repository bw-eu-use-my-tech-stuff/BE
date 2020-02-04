const db = require("../data/dbconfig");

const getEquipments = () => {
  return db("equipments");
};

const addEquipment = () => {
  return db("equipments")
    .insert(equipment)
    .then(([id]) => getEquipmentById(id));
};

const getEquipmentById = id => {
  return db("equipments")
    .where({ id })
    .first();
};

module.exports = {
  getEquipments,
  addEquipment,
  getEquipmentById
};
