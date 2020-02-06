const db = require("../data/dbconfig");

async function addRent(rent_details, equipment_id) {
  const [id] = await db("rent_details").insert(
    {
      start_time: rent_details.start_time,
      equipment_id,
      duration: rent_details.duration,
      user_id: rent_details.user_id
    },
    "id"
  );
  await db("equipments")
    .where({ id: equipment_id })
    .update("available", "0");
  const createdRent = await getRentDetailsById(id);
  return createdRent;
}

function getRentDetails() {
  return db("rent_details")
    .join("equipments", "equipments.id", "rent_details.equipment_id")
    .select(
      "rent_details.user_id",
      "rent_details.id",
      "rent_details.start_time",
      "rent_details.duration",
      "equipments.name",
      "equipments.description",
      "equipments.cost",
      "equipments.category"
    );
}

async function getRentDetailsById(id) {
  const allRent = await db("rent_details")
    .join("equipments", "equipments.id", "rent_details.equipment_id")
    .select(
      "rent_details.user_id",
      "rent_details.id",
      "rent_details.start_time",
      "rent_details.duration",
      "equipments.name",
      "equipments.description",
      "equipments.cost",
      "equipments.category"
    );
  return allRent.find(rent => rent.id == id);
}

module.exports = {
  addRent,
  getRentDetails,
  getRentDetailsById
};
