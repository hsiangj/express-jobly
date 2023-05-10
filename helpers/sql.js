const { BadRequestError } = require("../expressError");

/** Helper function that creates partial update queries to be used in making the SET clause of an SQL UPDATE.
 * 
 * dataToUpdate expects an object with new value(s) to be updated: {firstName: 'Aliya', age: 32}
 * jsToSql: expects an object with table column names as values: {firstName: "first_name", lastName: "last_name", isAdmin: "is_admin"}
 * 
 * The keys of dataToUpdate is mapped over to create a query statement along with jsToSql: {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
 * 
 * Example of return: 
 * { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
        
  */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
