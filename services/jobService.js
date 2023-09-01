const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function jobsByCategory() {
    // const offset = helper.getOffset(page, config.listPerPage);

    const query = `SELECT title as label, COUNT(*) as count
                    FROM jobs
                    WHERE active = 1
                    GROUP BY title
                    LIMIT 4`
    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}

async function jobsByLocation() {
    const query = `SELECT * FROM
                    (SELECT 
                        location as label,
                        COUNT(*) as count 
                        FROM recruit.jobs
                        WHERE active = 1
                        GROUP BY location) as t1
                    ORDER BY t1.count DESC
                    LIMIT 4;`
    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}

async function recentJobs() {
    const query = `SELECT title, location, category, created, jobId from recruit.jobs order by created desc limit 5`;
    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}

async function getJobDetails(jobId) {
    const query = `SELECT * from recruit.jobs where jobId='${jobId}' and id <> 0`;
    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}


module.exports = {
    jobsByCategory,
    jobsByLocation,
    recentJobs,
    getJobDetails,
};
