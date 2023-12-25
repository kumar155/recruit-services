const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();

async function getTypes(vendorId) {
    const query = `
    SELECT cs.type, count(*) as count from (
        SELECT jobId FROM jobs where postedBy='${vendorId}' and active = 1) as jobs 
        INNER JOIN candidatestatus as cs
        ON jobs.jobId = cs.jobId
        group by cs.type
        order by cs.type asc;`
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);

    return {
        data,
    };
}

module.exports = {
    getTypes,
};
