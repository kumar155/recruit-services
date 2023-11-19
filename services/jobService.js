const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();

async function jobsByCategory() {
    const query = `SELECT * from (SELECT title as label, COUNT(*) as count
                        FROM recruit.jobs
                        WHERE active = 1
                        GROUP BY title) as t1
                        ORDER BY t1.count DESC
                        LIMIT 4`;
    // const rows = await dbCon.execute(connection,query);
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}

async function jobsByLocation() {
    // await dbCon.connection();
    const query = `SELECT * FROM
                    (SELECT 
                        location as label,
                        COUNT(*) as count 
                        FROM recruit.jobs
                        WHERE active = 1
                        GROUP BY location) as t1
                    ORDER BY t1.count DESC
                    LIMIT 4;`
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}

async function getAllLocations() {
    // await dbCon.connection();
    const query = `SELECT * FROM
                    (SELECT 
                        location as label,
                        COUNT(*) as count 
                        FROM jobs
                        WHERE active = 1
                        GROUP BY location) as t1
                    ORDER BY t1.count DESC;`
    const rows = await dbCon.execute(connection, query);
    return helper.emptyOrRows(rows);
}

async function getAllCategories() {
    // await dbCon.connection();
    const query = `SELECT * from (SELECT title as label, COUNT(*) as count
                    FROM jobs
                    WHERE active = 1
                    GROUP BY title) as t1
                    ORDER BY t1.count DESC`
    const rows = await dbCon.execute(connection, query);
    return helper.emptyOrRows(rows);
}

async function recentJobs(page) {
    // await dbCon.connection();
    const limit = 5 * page;
    const query = `SELECT title, location, category, created, jobId from jobs where active = 1 order by created desc limit ${limit}`;
    const rows = await dbCon.execute(connection, query);
    const count = await dbCon.execute(connection, `SELECT count(*) as count from jobs where active = 1`);
    const data = helper.emptyOrRows(rows);
    return {
        data,
        count: count[0].count,
    };
}

async function getJobDetails(jobId) {
    // await dbCon.connection();
    const query = `SELECT * from recruit.jobs where jobId='${jobId}' and id <> 0`;
    const skillsQuery = `SELECT * from skills`;
    const rows = await dbCon.execute(connection, query);
    const skills = await dbCon.execute(connection, skillsQuery);
    const res = {
        jobs: helper.emptyOrRows(rows),
        skills: helper.emptyOrRows(skills),
    };
    return res;
}

async function getJobsByCategory({ category, page }) {
    // await dbCon.connection();
    const query = `SELECT * FROM recruit.jobs where title = '${category}' and active = 1 and id <> 0`;
    const rows = await dbCon.execute(connection, query);
    const count = await dbCon.execute(connection, `SELECT count(*) as count from jobs where title = '${category}' and active = 1`);

    return {
        data: helper.emptyOrRows(rows),
        count: count[0].count,
    };
}

async function getJobsByLocation({ location, page }) {
    // await dbCon.connection();
    const query = `SELECT * FROM recruit.jobs where location = '${location}' and active = 1 and id <> 0`;
    const rows = await dbCon.execute(connection, query);

    const count = await dbCon.execute(connection, `SELECT count(*) as count from jobs where location = '${location}' and active = 1`);

    return {
        data: helper.emptyOrRows(rows),
        count: count[0].count,
    };
}

async function getJobsByFilters({ category, location, page }) {
    // await dbCon.connection();
    const query = `SELECT * FROM recruit.jobs where title = '${category}' and location = '${location}' and active = 1 and id <> 0`;
    const rows = await dbCon.execute(connection, query);
    const count = await dbCon.execute(connection, `SELECT count(*) as count from jobs where title = '${category}' and location = '${location}' and active = 1`);
    return {
        data: helper.emptyOrRows(rows),
        count: count[0].count,
    };
}


module.exports = {
    jobsByCategory,
    jobsByLocation,
    recentJobs,
    getJobDetails,
    getJobsByCategory,
    getJobsByLocation,
    getJobsByFilters,
    getAllLocations,
    getAllCategories,
};
