require("dotenv").config();
const server = require("./api/server");

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`\n** API is running on port: ${PORT} **\n`)
);
