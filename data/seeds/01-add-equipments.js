exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("equipments")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("equipments").insert([
        {
          id,
          name: "Canon EOS 5D Mark III Digital SLR",
          category: "Cameras",
          cost: 128.9,
          user_id: 1,
          available: 1
        },
        {
          id,
          name: "Manfrotto 12' 1004BAC QSS Air Cushioned Light Stand",
          category: "Lighting",
          cost: 61.0,
          user_id: 1,
          available: 1
        },
        {
          id,
          name: "Sony FE 24-70mm f/2.8 GM Lens",
          category: "Lens",
          cost: 125.0,
          user_id: 1,
          available: 1
        },
        {
          id,
          name: "Circular Polarizing 77mm Filter",
          category: "Accessories",
          cost: 11.0,
          user_id: 2,
          available: 1
        },
        {
          id,
          name: "DJI Ronin-S Handheld Gimbal Stabilizer",
          category: "Support",
          cost: 71.0,
          user_id: 2,
          available: 1
        },
        {
          id,
          name: "Zhiyun-Tech Crane 3 LAB Gimbal",
          category: "Support",
          cost: 88.0,
          user_id: 1,
          available: 0
        },
        {
          id,
          name: "Extra Sony NP-FZ100 Battery",
          category: "Accessories",
          cost: 21.0,
          user_id: 2,
          available: 0
        }
      ]);
    });
};
