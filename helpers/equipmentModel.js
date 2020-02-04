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

const addEquipment = equipment => {
  return db("equipments")
    .insert(equipment)
    .then(([id]) => getEquipmentById(id));
};

const getEquipmentById = id => {
  return db("equipments")
    .where({ id })
    .first();
};

const updateEquipment = (changes, id) => {
  db("equipments")
    .where({ id })
    .update(changes)
    .then(count => {
      return count > 0 ? getEquipmentById(id) : null;
    });
};

const deleteEquipment = id => {
  return db("equipments")
    .where({ id })
    .del();
};

const getOwnerIdByEquipmentId = id => {
  return db("equipments")
    .select("user_id")
    .where({ id })
    .first();
};

module.exports = {
  getEquipments,
  addEquipment,
  getEquipmentById,
  getOwnerIdByEquipmentId,
  updateEquipment,
  deleteEquipment
};
