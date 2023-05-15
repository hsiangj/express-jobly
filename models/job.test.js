const db = require("../db.js");
const { NotFoundError, BadRequestError } = require("../expressError");
const Job = require('../models/job');
const { update } = require("./user.js");
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
    companyHandle: "c1"
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
  });

  test("returns error if job not found", async function () {
    await expect(Job.get(9999)).rejects.toThrow(NotFoundError);
  });
})

/************************************** update */

describe("update", function() {
  let updateData = {
    title: "update j1",
    salary: 200,
    equity: "0.70"
  }
  test("works: updating a job", async function () {
    let job = await Job.update(testJobIds[0], updateData);
    expect(job).toEqual({
      id: testJobIds[0],
      companyHandle: "c3",
      ...updateData
    })
  });

  test("not found error if job not found", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request error if no data", async function () {
    try {
      await Job.update(testJobIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

})


/************************************** remove */
describe("remove", function() {
  test("works: removing a job", async function () {
    await Job.remove(testJobIds[0]);
    const res = await db.query(`SELECT id FROM jobs WHERE id = $1`, [testJobIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found error if job not found", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})