const db = require("../data/dbconfig");

const getEquipments = () => {
  return db("equipments")
    .join("users", "users.id", "equipments.user_id")
    .select(
      "equipments.id",
      "equipments.name",
      "equipments.category",
      "equipments.cost",
      "equipments.available",
      "equipments.description",
      "users.username as owner_username"
    );
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
