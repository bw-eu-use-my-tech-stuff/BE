const db = require("../data/dbconfig");

const getEquipment = () => {
  return db("equipments");
};

const postEquipment = () => {
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
  getEquipment,
  postEquipment,
  getEquipmentById
};
