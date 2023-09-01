const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getAll(page = 1) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * FROM skills`
    );
    const data = helper.emptyOrRows(rows);
    // const meta = { page };

    return {
        data,
        // meta,
    };
}


async function create(skill) {
    const query = `INSERT INTO skills
        (label, active) 
        VALUES 
        ('${skill.value}', 1)`
    const result = await db.query(query);

    let message = "Error in publishing a skill";
    let response;

    if (result.affectedRows) {
        message = "Done";
        const getQuery = `SELECT id from skills where (label='${skill.value}' and id <> 0) `;
        const id = await db.query(getQuery);
        response = id;
    }

    return { message, response };
}

module.exports = {
    getAll,
    create
};
