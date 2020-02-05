const db = require("../data/dbconfig");
const {
  addEquipment,
  deleteEquipment,
  updateEquipment
} = require("./equipmentModel");
const { addUser } = require("./authModel");

beforeEach(async () => {
  await db("users").truncate();
  await db("equipments").truncate();
});

describe("Equipments Model", () => {
  describe("Add Equipment", () => {
    it("Adds an equpment into the db", async () => {
      await addUser({
        username: "admin",
        password: "1234",
        account_type: "owner"
      });
      await addEquipment({
        name: "Canon EOS 5D Mark III Digital SLR",
        category: "Cameras",
        cost: 128.9,
        user_id: 1,
        available: 1,
        description: "Rent a Canon EOS 5D Mark III Digital SLR"
      });
      const equipments = await db("equipments");
      expect(equipments).toHaveLength(1);
    });

    it("Returns the added equipment", async () => {
      await addUser({
        username: "admin",
        password: "1234",
        account_type: "owner"
      });
      await addEquipment({
        name: "Canon EOS 5D Mark III Digital SLR",
        category: "Cameras",
        cost: 128.9,
        user_id: 1,
        available: 1,
        description: "Rent a Canon EOS 5D Mark III Digital SLR"
      }).then(equipment => {
        expect(equipment).toMatchObject({
          id: 1,
          name: "Canon EOS 5D Mark III Digital SLR",
          category: "Cameras",
          cost: 128.9,
          user_id: 1,
          available: 1,
          description: "Rent a Canon EOS 5D Mark III Digital SLR"
        });
      });
    });
  });

  describe("Delete equipment", () => {
    it("Deletes an equipment from the database", async () => {
      await addUser({
        username: "admin",
        password: "1234",
        account_type: "owner"
      });
      await db("equipments").insert({
        name: "Canon EOS 5D Mark III Digital SLR",
        category: "Cameras",
        cost: 128.9,
        user_id: 1,
        available: 1,
        description: "Rent a Canon EOS 5D Mark III Digital SLR"
      });
      const equipments = await db("equipments");
      expect(equipments).toHaveLength(1);
      await deleteEquipment(1);
      const newequipments = await db("equipments");
      expect(newequipments).toHaveLength(0);
    });
  });

  describe("Update equipment", () => {
    it("Updates an equipment on the database", async () => {
      await addUser({
        username: "admin",
        password: "1234",
        account_type: "owner"
      });
      await db("equipments").insert({
        name: "Canon EOS 5D Mark III Digital SLR",
        category: "Cameras",
        cost: 128.9,
        user_id: 1,
        available: 1,
        description: "Rent a Canon EOS 5D Mark III Digital SLR"
      });
      await updateEquipment(
        {
          name: "Updated name",
          category: "Cameras",
          cost: 90,
          user_id: 1,
          available: 1,
          description: "Updated description"
        },
        1
      );
      const updated = await db("equipments").first();
      expect(updated).toMatchObject({
        id: 1,
        name: "Updated name",
        category: "Cameras",
        cost: 90,
        user_id: 1,
        available: 1,
        description: "Updated description"
      });
    });
  });
});
