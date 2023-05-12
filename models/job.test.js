const db = require("../db.js");
const { NotFoundError } = require("../expressError");
const Job = require('../models/job');
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new job",
    salary: 60000,
    equity: "0",
    company_handle: "c1"
  };

  test("works: create a job", async function () {
    const job = await Job.create(newJob);
    expect(job).toEqual(
      {
        id: expect.any(Number),
        title: "new job",
        salary: 60000,
        equity: "0",
        companyHandle: "c1"
      }
    );
  })
})

/************************************** findAll */

describe("findAll", function () {
  test("works: without filter", async function () {
    const jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 70000,
        equity: "0.52",
        companyHandle: "c3"
      },
      {
        id: expect.any(Number),
        title: "j2",
        salary: 80000,
        equity: "0",
        companyHandle: "c2"
      },
      {
        id: expect.any(Number),
        title: "j3",
        salary: null,
        equity: null,
        companyHandle: "c1"
      }
    ])

  })
})

/************************************** get */

describe("get", function() {
  test("works: getting a job", async function () {
    let job = await Job.get(testJobIds[0]);
    expect(job).toEqual({
      id: testJobIds[0],
      title: "j1",
      salary: 70000,
      equity: "0.52",
      companyHandle: "c3"
    })
  })
})