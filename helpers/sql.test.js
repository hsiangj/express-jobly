const { BadRequestError } = require('../expressError');
const {sqlForPartialUpdate} = require('./sql');


describe("sqlForPartialUpdate", () => {
  test("Valid string data to be converted", () =>{
    const data = {"firstName": "Hermione", "lastName": "Granger"}
    const jsToSqlTest = {firstName: "first_name", lastName: "last_name"};
    const result = sqlForPartialUpdate(data,jsToSqlTest);
  
    expect(result).toEqual({ setCols: '"first_name"=$1, "last_name"=$2',values: ["Hermione", "Granger"] });
  });

  test("Valid number data to be converted", () =>{
    const data = {"age":32}
    const jsToSqlTest = {firstName: "first_name", lastName: "last_name"};
    const result = sqlForPartialUpdate(data,jsToSqlTest);
  
    expect(result).toEqual({ setCols: '"age"=$1',values: [32] });
  });

  test("Invalid data to throw error", () =>{
    const data = {}
    const jsToSqlTest = {firstName: "first_name", lastName: "last_name"};
    
    expect(() => sqlForPartialUpdate(data,jsToSqlTest)).toThrow(BadRequestError);
  });

})