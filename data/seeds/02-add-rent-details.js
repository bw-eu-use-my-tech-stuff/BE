exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("rent_details")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("rent_details").insert([
        {
          equipment_id: 4,
          start_time: "2020-02-05",
          duration: 1,
          user_id: 2
        },
        {
          equipment_id: 5,
          start_time: "2020-02-04",
          duration: 5,
          user_id: 2
        }
      ]);
    });
};
