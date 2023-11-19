const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();
async function getAll(page = 1) {
    // await dbCon.connection();
    // const offset = helper.getOffset(page, config.listPerPage);
    const rows = await dbCon.execute(connection,
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
    // await dbCon.connection();
    const getSkill = `SELECT id from skills where (label='${skill.value}' and id <> 0) `;
    let response;
    let message = "Exists";
    const hasSkill = await dbCon.execute(connection,getSkill)
    if (hasSkill.length > 0) {
        response = hasSkill;
        return { message, response };
    }
    const query = `INSERT INTO skills
        (label, active) 
        VALUES 
        ('${skill.value}', 1)`
    const result = await dbCon.execute(connection,query);

    message = "Error in publishing a skill";

    if (result.affectedRows) {
        message = "Done";
        // const getQuery = `SELECT id from skills where (label='${skill.value}' and id <> 0) `;
        const id = await dbCon.execute(connection,getSkill);
        response = id;
    }

    return { message, response };
}

module.exports = {
    getAll,
    create
};
