const cleaner = require("knex-cleaner");

exports.seed = function(knex) {
  return cleaner.clean(knex, {
    mode: "truncate", // resets ids
    ignoreTables: ["knex_migrations", "knex_migrations_lock", "users"] // don't empty migration tables
  });
};
