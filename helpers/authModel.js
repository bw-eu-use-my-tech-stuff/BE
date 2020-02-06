const db = require("../data/dbconfig");

const addUser = user => {
  return db("users")
    .insert(user, "id")
    .then(([id]) => getUserById(id));
};

const getUserById = id => {
  return db("users")
    .where({ id })
    .first();
};

const getUsers = () => {
  return db("users");
};

const findUser = filter => {
  return db("users")
    .where(filter)
    .first();
};

const getAccountTypeWithId = id => {
  return db("users")
    .select("account_type")
    .where({ id })
    .first();
};

module.exports = {
  addUser,
  getUserById,
  getUsers,
  findUser,
  getAccountTypeWithId
};
