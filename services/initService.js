const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();
async function getStatusTypes() {
    const rows = await dbCon.execute(connection,
        `SELECT * FROM statustypes where active = 1`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data,
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
    getStatusTypes,
    create
};
