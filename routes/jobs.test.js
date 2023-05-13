const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
  testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function() {
  const newJob = {
    title: "new job", 
    salary: 1, 
    equity: "0.1", 
    companyHandle: "c1" 
  };

  test("works for admin users", async function() {
    const resp = await request(app)
    .post("/jobs")
    .send(newJob)
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toBe(201);
  expect(resp.body).toEqual({
    job: {
      id: expect.any(Number),
      ...newJob
    }
  })
  });

  test("fail for non-admin users", async function() {
    const resp = await request(app)
    .post("/jobs")
    .send(newJob)
    .set("authorization", `Bearer ${u1Token}`);
  expect(resp.statusCode).toBe(401);
  });

  test("bad request with missing data(title)", async function() {
    const resp = await request(app)
    .post("/jobs")
    .send({
      salary: 1, 
      equity: "0.1", 
      companyHandle: "c1" 
    })
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toBe(400);
  });

  test("bad request with invalid data(salary)", async function() {
    const resp = await request(app)
    .post("/jobs")
    .send({
      title: "new job",
      salary: "salary", 
      equity: "0.1", 
      companyHandle: "c1" 
    })
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toBe(400);
  });
})

/************************************** GET /jobs */

describe("GET /jobs", function() {
  test("works for anon", async function() {
    const resp = await request(app).get("/jobs");
  expect(resp.body).toEqual({
    jobs : [
    { id: testJobIds[0],
      title: "J1", 
      salary: 1, 
      equity: "0.1", 
      companyHandle: "c1" 
    },
    { id: testJobIds[1],
      title: "J2", 
      salary: 2, 
      equity: "0.2", 
      companyHandle: "c1" 
    },
    { id: testJobIds[2],
      title: "J3", 
      salary: 3, 
      equity: null, 
      companyHandle: "c1" 
    } 
    ]
  })
  });

  test("works: filtering by single filter", async function() {
    const resp = await request(app).get("/jobs").query({title: "1"});
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({jobs:
    [{ 
      id: testJobIds[0],
      title: "J1", 
      salary: 1, 
      equity: "0.1", 
      companyHandle: "c1" 
      }]})
  });

  test("works: filtering by all options", async function() {
    const resp = await request(app).get("/jobs").query({title: "j", minSalary: 2, hasEquity: true });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({jobs:
      [{ 
        id: testJobIds[1],
        title: "J2", 
        salary: 2, 
        equity: "0.2", 
        companyHandle: "c1" 
      }]})
  });

  test('bad request error if invalid filter key', async function() {
    const resp = await request(app).get("/jobs").query({test: "test", hasEquity: true});
    expect(resp.statusCode).toBe(400);
  })
})

/************************************** GET /jobs/:id */

describe("GET /jobs/id", function() {
  test("works for anon", async function() {
    const resp = await request(app).get(`/jobs/${testJobIds[0]}`);
    expect(resp.body).toEqual({
      job: 
        { id: testJobIds[0],
          title: "J1", 
          salary: 1, 
          equity: "0.1", 
          companyHandle: "c1" 
        }
    })
  });

  test("not found for no such company", async function() {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  })
})

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function() {
  test("works for admin users", async function() {
    const resp = await request(app)
    .patch(`/jobs/${testJobIds[0]}`)
    .send({
      title: "update J1"
    })
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.body).toEqual({
    job:
    {
      id: testJobIds[0],
      title: "update J1", 
      salary: 1, 
      equity: "0.1", 
      companyHandle: "c1"
    }
  })
  });

  test("fails for non-admin users", async function() {
    const resp = await request(app)
      .patch(`/jobs/${testJobIds[0]}`)
      .send({
      title: "update J1"
    })
    .set("authorization", `Bearer ${u1Token}`);
  expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function() {
    const resp = await request(app).patch("/jobs/0").send({
      title: "update J1"
    }).set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toEqual(404);
  });

  test("bad request with unaccepted data", async function() {
    const resp = await request(app)
    .patch(`/jobs/${testJobIds[0]}`)
    .send({
      companyHandle: "new", 
    })
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toBe(400);
  });

  test("bad request with invalid data(salary)", async function() {
    const resp = await request(app)
    .patch(`/jobs/${testJobIds[0]}`)
    .send({
      salary: "salary", 
    })
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toBe(400);
  });

})

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function() {
  test("works for admin users", async function() {
    const resp = await request(app)
      .delete(`/jobs/${testJobIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
  expect(resp.body).toEqual({deleted: testJobIds[0] })
  });

  test("fails for non-admin users", async function() {
    const resp = await request(app)
      .delete(`/jobs/${testJobIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
  expect(resp.statusCode).toBe(401);
  });

  test("not found for no such job", async function() {
    const resp = await request(app)
      .delete(`/jobs/0`)
      .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toBe(404);
  });
})