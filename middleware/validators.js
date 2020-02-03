function validateUserId(req, res, next) {
  const { id } = req.params;
  let validId = Number(id);
  if (!Number.isInteger(validId) && validId > 0) {
    next({ message: "Invalid user id" });
  }
  Users.getUser({ id: validId })
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next({ message: "Could not find user with given id", status: 404 });
      }
    })
    .catch(next);
}

function validateUserBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      message: "Missing required `username` and `password` fields",
      status: 401
    });
  } else {
    req.body = { username, password };
    next();
  }
}

module.exports = {
  validateUserBody,
  validateUserId
};
