function restricted(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "as$q87sRwqQ!wPbc76@=C5%TX+dwR5&$",
      (err, decodedUser) => {
        if (err) {
          res.status(400).json({
            message: `Your token is unauthorized. Please check and try again`
          });
        } else {
          req.loggedInUser = decodedUser;
          next();
        }
      }
    );
  } else {
    res.status(400).json({ message: `No token provided. You shall not pass` });
  }
}

module.exports = {
  restricted
};
