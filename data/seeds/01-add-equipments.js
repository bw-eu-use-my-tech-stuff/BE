exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("equipments")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("equipments").insert([
        {
          name: "Canon EOS 5D Mark III Digital SLR",
          category: "Cameras",
          cost: 128.9,
          user_id: 1,
          available: 1,
          description: "Rent a Canon EOS 5D Mark III Digital SLR"
        },
        {
          name: "Manfrotto 12' 1004BAC QSS Air Cushioned Light Stand",
          category: "Lighting",
          cost: 61.0,
          user_id: 1,
          available: 1,
          description:
            "Rent a Manfrotto 12' 1004BAC QSS Air Cushioned Light Stand"
        },
        {
          name: "Sony FE 24-70mm f/2.8 GM Lens",
          category: "Lens",
          cost: 125.0,
          user_id: 1,
          available: 1,
          description: "Rent a Sony FE 24-70mm f/2.8 GM Lens"
        },
        {
          name: "Circular Polarizing 77mm Filter",
          category: "Accessories",
          cost: 11.0,
          user_id: 2,
          available: 1,
          description: "Rent a Circular Polarizing 77mm Filter"
        },
        {
          name: "DJI Ronin-S Handheld Gimbal Stabilizer",
          category: "Support",
          cost: 71.0,
          user_id: 2,
          available: 1,
          description: "Rent a DJI Ronin-S Handheld Gimbal Stabilizer. "
        },
        {
          name: "Zhiyun-Tech Crane 3 LAB Gimbal",
          category: "Support",
          cost: 88.0,
          user_id: 1,
          available: 0,
          description: "Rent a Zhiyun-Tech Crane 3 LAB Gimbal. "
        },
        {
          name: "Extra Sony NP-FZ100 Battery",
          category: "Accessories",
          cost: 21.0,
          user_id: 2,
          available: 0,
          description: "Rent an Extra NP-FZ100 Battery. "
        }
      ]);
    });
};
