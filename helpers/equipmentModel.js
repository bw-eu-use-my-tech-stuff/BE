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
    .insert(equipment, "id")
    .then(([id]) => getEquipmentById(id));
};

const getEquipmentById = async id => {
  const equipments = await getEquipments();
  return equipments.find(equipment => equipment.id == id);
};

const updateEquipment = (changes, id) => {
  return db("equipments")
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

const isEquipmentAvailable = async id => {
  const { available } = await db("equipments")
    .select("available")
    .where({ id })
    .first();
  return available == 1 ? true : false;
};

module.exports = {
  getEquipments,
  addEquipment,
  getEquipmentById,
  getOwnerIdByEquipmentId,
  updateEquipment,
  deleteEquipment,
  isEquipmentAvailable
};
