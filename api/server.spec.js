const request = require("supertest");
const server = require("./server");
const db = require("../data/dbconfig");

beforeEach(async () => {
  await db("users").truncate();
  await db("equipments").truncate();
  await db("rent_details").truncate();
});

afterAll(() => {
  db.destroy();
});

describe("Server is up and running", () => {
  it("Returns 200 OK status and  message", async () => {
    const res = await request(server).get("/api");
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject({
      message: `This server is working correctly`
    });
  });
});

describe("AUTH Route", () => {
  describe("Register endpoint", () => {
    describe("POST /register", () => {
      it("Returns a 201 status", () => {
        return request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" })
          .expect(201);
      });
      it("Returns the new user object", async () => {
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
      it("Returns a 200 OK status", async () => {
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

      it("Returns the logged in user token ", () => {
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

describe("EQUIPMENTS Route", () => {
  describe("Equipment Endpoint", () => {
    describe("POST /equipment", () => {
      it("Adds a new equipment to database", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        const res = await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        expect(res.body).toMatchObject({
          id: 1,
          name: "Canon EOS 5D Mark III Digital SLR",
          category: "Cameras",
          cost: 190.9,
          available: 1,
          description: "Rent a Canon EOS 5D Mark III Digital SLR",
          owner_username: "admin"
        });
      });

      it("Returns status 400 and message with wrong acccount type", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({
            username: "admin",
            password: "1234",
            account_type: "renter"
          });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        const res = await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        expect(res.status).toEqual(400);
        expect(res.body).toMatchObject({
          message: "Invalid account type. Use a owner account"
        });
      });

      it("Returns status 400 and error message without token", async () => {
        const res = await request(server)
          .post("/api/equipments")
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        expect(res.status).toEqual(400);
        expect(res.body).toMatchObject({
          message: `No token provided. You shall not pass`
        });
      });

      it("Returns status 400 and error message if token is wrong", async () => {
        const res = await request(server)
          .post("/api/equipments")
          .set("Authorization", "a-random-token")
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        expect(res.status).toEqual(400);
        expect(res.body).toMatchObject({
          message: `Your token is unauthorized. Please check and try again`
        });
      });
    });

    describe("GET /equipment", () => {
      it("Gets all equipments in the database", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        const res = await request(server).get("/api/equipments");
        expect(res.body).toHaveLength(1);
      });
    });

    describe("GET /equipment/:id", () => {
      it("Gets an equipment with id from the database", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        const res = await request(server).get("/api/equipments/1");
        expect(res.body).toMatchObject({
          id: 1,
          name: "Canon EOS 5D Mark III Digital SLR",
          category: "Cameras",
          cost: 190.9,
          available: 1,
          description: "Rent a Canon EOS 5D Mark III Digital SLR",
          owner_username: "admin"
        });
      });

      it("Returns status 400 and error message when id does not exist", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        const res = await request(server).get("/api/equipments/3");
        expect(res.status).toEqual(400);
        expect(res.body).toMatchObject({
          message: `Equipment with ID:3 does not exist`
        });
      });
    });

    describe("PUT /equipment/:id", () => {
      it("Returns the updated equipment object", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        const res = await request(server)
          .put("/api/equipments/1")
          .set("Authorization", token)
          .send({
            name: "Updated Name",
            category: "Lightning",
            cost: 190.9,
            description: "Updated description"
          });
        expect(res.body).toMatchObject({
          id: 1,
          name: "Updated Name",
          category: "Lightning",
          cost: 190.9,
          available: 1,
          description: "Updated description",
          owner_username: "admin"
        });
      });
    });

    describe("DELETE /equipment/:id", () => {
      it("Returns 200 OK status and message", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        const res = await request(server)
          .delete("/api/equipments/1")
          .set("Authorization", token);
        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject({
          message: `Equipment has been deleted from the database`
        });
      });

      it("Returns 400 status and message if account does not own equipment", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        await request(server)
          .post("/api/auth/register")
          .send({
            username: "admin2",
            password: "1234",
            account_type: "owner"
          });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        const newLoggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin2", password: "1234" });
        const newToken = newLoggedIn.body.token;
        const res = await request(server)
          .delete("/api/equipments/1")
          .set("Authorization", newToken);
        expect(res.status).toEqual(400);
        expect(res.body).toMatchObject({
          message: `You cannot make changes to this equipment`
        });
      });
    });
  });
});

describe("RENT Route", () => {
  describe("Rent Endpoint", () => {
    describe("POST /rent/:equipment_id", () => {
      it("Returns the newly created rental object", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        await request(server)
          .post("/api/auth/register")
          .send({
            username: "renter",
            password: "1234",
            account_type: "renter"
          });
        const rentloggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "renter", password: "1234" });
        const rentToken = rentloggedIn.body.token;
        const res = await request(server)
          .post("/api/rent/1")
          .set("Authorization", rentToken)
          .send({
            start_time: "2020-02-04",
            duration: "20"
          });
        expect(res.body).toHaveProperty("user_id");
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("duration");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("description");
        expect(res.body).toHaveProperty("cost");
      });

      it("Adds a new rental info to database", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        await request(server)
          .post("/api/auth/register")
          .send({
            username: "renter",
            password: "1234",
            account_type: "renter"
          });
        const rentloggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "renter", password: "1234" });
        const rentToken = rentloggedIn.body.token;
        await request(server)
          .post("/api/rent/1")
          .set("Authorization", rentToken)
          .send({
            start_time: "2020-02-04",
            duration: "20"
          });
        const rentals = await db("rent_details");
        expect(rentals).toHaveLength(1);
      });

      it("Returns status 400 and error message if equipment is already rented", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        await request(server)
          .post("/api/auth/register")
          .send({
            username: "renter",
            password: "1234",
            account_type: "renter"
          });
        const rentloggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "renter", password: "1234" });
        const rentToken = rentloggedIn.body.token;
        await request(server)
          .post("/api/rent/1")
          .set("Authorization", rentToken)
          .send({
            start_time: "2020-02-04",
            duration: "20"
          });
        const res = await request(server)
          .post("/api/rent/1")
          .set("Authorization", rentToken)
          .send({
            start_time: "2020-02-04",
            duration: "20"
          });
        expect(res.status).toEqual(400);
        expect(res.body).toMatchObject({
          message: "This equipment has been rented already"
        });
      });
    });

    describe("GET /rent/", () => {
      it("Returns an array of all your rents", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({ username: "admin", password: "1234", account_type: "owner" });
        const loggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "admin", password: "1234" });
        const token = loggedIn.body.token;
        await request(server)
          .post("/api/equipments")
          .set("Authorization", token)
          .send({
            name: "Canon EOS 5D Mark III Digital SLR",
            category: "Cameras",
            cost: 190.9,
            description: "Rent a Canon EOS 5D Mark III Digital SLR"
          });
        await request(server)
          .post("/api/auth/register")
          .send({
            username: "renter",
            password: "1234",
            account_type: "renter"
          });
        const rentloggedIn = await request(server)
          .post("/api/auth/login")
          .send({ username: "renter", password: "1234" });
        const rentToken = rentloggedIn.body.token;
        await request(server)
          .post("/api/rent/1")
          .set("Authorization", rentToken)
          .send({
            start_time: "2020-02-04",
            duration: "20"
          });
        const res = await request(server)
          .get("/api/rent/")
          .set("Authorization", rentToken);
        expect(res.body).toHaveLength(1);
      });
    });
  });
});
