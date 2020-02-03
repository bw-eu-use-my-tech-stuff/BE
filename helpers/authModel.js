const db = require("../data/dbconfig");

const addUser = user => {
  return db("users")
    .insert(user)
    .then(ids => getUser({ id: ids[0] }));
};

const getUserById = () => {
  return db("users")
    .where(dataObj)
    .first();
};

// const getUser = id => {
//   return db("users")
//     .where({ id })
//     .first();
// };

const getUsers = () => {
  return db("users");
};

function findUser(filter) {
  return db("users")
    .where(filter)
    .first();
}

module.exports = {
  addUser,
  getUserById,
  getUsers,
  findUser
};
