const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

async function jobsByCategory() {
    // await dbCon.connection();
    const query = `SELECT * from (SELECT title as label, COUNT(*) as count
                        FROM recruit.jobs
                        WHERE active = 1
                        GROUP BY title) as t1
                        ORDER BY t1.count DESC
                        LIMIT 4`;
    const rows = await db.query(query);
    // const [rows] = await dbCon.execute(query);
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

async function getAllLocations() {
    const query = `SELECT * FROM
                    (SELECT 
                        location as label,
                        COUNT(*) as count 
                        FROM jobs
                        WHERE active = 1
                        GROUP BY location) as t1
                    ORDER BY t1.count DESC;`
    const rows = await db.query(query);
    return helper.emptyOrRows(rows);
}

async function getAllCategories() {
    const query = `SELECT * from (SELECT title as label, COUNT(*) as count
                    FROM jobs
                    WHERE active = 1
                    GROUP BY title) as t1
                    ORDER BY t1.count DESC`
    const rows = await db.query(query);
    return helper.emptyOrRows(rows);
}

async function recentJobs(page) {
    const limit = 5 * page;
    const query = `SELECT title, location, category, created, jobId from jobs where active = 1 order by created desc limit ${limit}`;
    const rows = await db.query(query);
    const count = await db.query(`SELECT count(*) as count from jobs where active = 1`);
    const data = helper.emptyOrRows(rows);
    return {
        data,
        count: count[0].count,
    };
}

async function getJobDetails(jobId) {
    const query = `SELECT * from recruit.jobs where jobId='${jobId}' and id <> 0`;
    const skillsQuery = `SELECT * from skills`;
    const rows = await db.query(query);
    const skills = await db.query(skillsQuery);
    const res = {
        jobs: helper.emptyOrRows(rows),
        skills: helper.emptyOrRows(skills),
    };
    return res;
}

async function getJobsByCategory({ category, page }) {
    const query = `SELECT * FROM recruit.jobs where title = '${category}' and active = 1 and id <> 0`;
    const rows = await db.query(query);
    const count = await db.query(`SELECT count(*) as count from jobs where title = '${category}' and active = 1`);

    return {
        data: helper.emptyOrRows(rows),
        count: count[0].count,
    };
}

async function getJobsByLocation({ location, page }) {
    const query = `SELECT * FROM recruit.jobs where location = '${location}' and active = 1 and id <> 0`;
    const rows = await db.query(query);
    
    const count = await db.query(`SELECT count(*) as count from jobs where location = '${location}' and active = 1`);

    return {
        data: helper.emptyOrRows(rows),
        count: count[0].count,
    };
}

async function getJobsByFilters({ category, location, page }) {
    const query = `SELECT * FROM recruit.jobs where title = '${category}' and location = '${location}' and active = 1 and id <> 0`;
    const rows = await db.query(query);
    const count = await db.query(`SELECT count(*) as count from jobs where title = '${category}' and location = '${location}' and active = 1`);
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
