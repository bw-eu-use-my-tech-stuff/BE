exports.up = function(knex) {
  return knex.schema
    .createTable("users", tbl => {
      tbl.increments();
      tbl
        .string("username", 255)
        .notNullable()
        .unique();
      tbl.string("password", 255).notNullable();
      tbl.text("account_type", 156).notNullable();
    })

    .createTable("rent_details", tbl => {
      tbl.increments();
      tbl
        .integer("equipment_id", 128)
        .unsigned()
        .notNullable()
        .unique()
        .references("id")
        .inTable("equipments")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .date("start_time")
        .unsigned()
        .notNullable();
      tbl
        .integer("duration", 128)
        .unsigned()
        .notNullable();
      tbl
        .integer("user_id", 128)
        .unsigned()
        .notNullable()
        .unique()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })

    .createTable("equipments", tbl => {
      tbl.increments();
      tbl
        .string("name", 255)
        .unique()
        .notNullable();
      tbl
        .string("category", 255)
        .unique()
        .notNullable();
      tbl
        .decimal("cost")
        .unsigned()
        .unique()
        .notNullable();
      tbl
        .integer("user_id", 128)
        .unsigned()
        .notNullable()
        .unique()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.boolean("available").defaultTo(true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("equipments")
    .dropTableIfExists("rent_details")
    .dropTableIfExists("users");
};
