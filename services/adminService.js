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


async function getLocationStats(vendorId) {
    const query = `
    SELECT j.location, COUNT(*) as jobs FROM jobs as j
    WHERE j.postedBy = '${vendorId}'
    GROUP BY j.location;`
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);

    return {
        data,
    };
}

async function getRecentJobs(vendorId) {
    const query = `
    SELECT jobId, title, location, category, created FROM jobs
    WHERE postedBy = '${vendorId}' and active = 1 order by created desc limit 6;`
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);

    return {
        data,
    };
}

async function getCategories(vendorId) {
    const query = `
    SELECT j.category, COUNT(*) as count FROM jobs as j
    WHERE j.postedBy = '${vendorId}' 
    GROUP BY j.category
    ORDER BY j.category asc limit 5;`;
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);

    return {
        data,
    };
}
module.exports = {
    getTypes,
    getLocationStats,
    getRecentJobs,
    getCategories,
};
