exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("rent_details")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("rent_details").insert([
        {
          id,
          equipment_id: 1,
          start_time: "2020-02-20",
          duration: 2,
          user_id: 1
        },
        {
          id,
          equipment_id: 2,
          start_time: "2020-02-10",
          duration: 3,
          user_id: 1
        },
        {
          id,
          equipment_id: 3,
          start_time: "2020-02-08",
          duration: 7,
          user_id: 1
        },
        {
          id,
          equipment_id: 4,
          start_time: "2020-02-05",
          duration: 1,
          user_id: 2
        },
        {
          id,
          equipment_id: 5,
          start_time: "2020-02-04",
          duration: 5,
          user_id: 2
        },
        {
          id,
          equipment_id: 6,
          start_time: "2020-02-14",
          duration: 2,
          user_id: 1
        },
        {
          id,
          equipment_id: 7,
          start_time: "2020-02-22",
          duration: 1,
          user_id: 2
        }
      ]);
    });
};
