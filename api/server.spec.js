const request = require("supertest");
const server = require("./server");
const db = require("../data/dbconfig");

beforeEach(async () => {
  await db("users").truncate();
  await db("equipments").truncate();
  console.log("Cleaned database");
});

describe("AUTH Route", () => {
  describe("Register endpoint", () => {
    describe("POST /register", () => {
      test("Returns a 201 status", () => {
        return request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" })
          .expect(201);
      });
      test("Returns the new user object", async () => {
        const res = await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" })
          .then(res => {
            expect(res.body).toHaveProperty("username");
            expect(res.body).toHaveProperty("id");
          });
      });
    });
  });

  describe("Login endpoint", () => {
    describe("POST /login", () => {
      test("Returns a 200 OK status", async () => {
        request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" })
          .then(res => {
            return request(server)
              .post("/api/auth/login")
              .send({ username: "admin", password: "1234" })
              .expect(200);
          });
      });
      test("Returns the logged in user token ", () => {
        request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" })
          .then(async res => {
            const loggedIn = await request(server)
              .post("/api/auth/login")
              .send({ username: "admin", password: "1234" });
            expect(loggedIn.body).toHaveProperty("token");
          });
      });
    });
  });
});

// describe("Equipments Route", () => {
//   describe("GET /equipments", () => {
//     test("Returns an empty array of equipments", () => {
//       request(server)
//         .get("/api/equipments")
//         .then(res => {
//           expect(res.body).toStrictEqual([]);
//         });
//     });
//   });

//   describe("POST /equipments", () => {
//     test("Returns an empty array of equipments", () => {
//       request(server)
//         .post("/api/auth/register")
//         .send({ username: "admin2", password: "1234", account_type: "owner" })
//         .then(next => {
//           request(server)
//             .post("/api/auth/login")
//             .send({ username: "admin2", password: "1234" })
//             .then(res => {
//               token = res.body;
//               request(server)
//                 .post("/api/equipments")
//                 .set("Authorization", token)
//                 .send({
//                   name: "Canon EOS 5D Mark III Digital SLR",
//                   category: "Cameras",
//                   cost: 128.9,
//                   description: "Rent a Canon EOS 5D Mark III Digital SLR"
//                 })
//                 .then(res2 => {
//                   console.log(res2.body);
//                 })
//                 .catch(error => {
//                   console.log(`Cannot add new equipment`);
//                 });
//             })
//             .catch(error => {
//               console.log(`Cannot Login`);
//             });
//         })
//         .catch(error => {
//           console.log(`Cannot register`);
//         });

//       //   request(server)
//       //     .post("/api/equipments")
//       //     .set("Authorization", token)
//       //     .send({
//       //       name: "Canon EOS 5D Mark III Digital SLR",
//       //       category: "Cameras",
//       //       cost: 128.9,
//       //       description: "Rent a Canon EOS 5D Mark III Digital SLR"
//       //     })
//       //     .then(res => {
//       //       console.log(res);
//       //     });
//     });
//   });
// });
