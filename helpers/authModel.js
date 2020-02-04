const db = require("../data/dbconfig");
const addUser = user => {
  return db("users")
    .insert(user)
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
module.exports = {
  addUser,
  getUserById,
  getUsers,
  findUser
};
