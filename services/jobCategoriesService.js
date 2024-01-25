const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();
async function setInactive(value) {
    const rows = await dbCon.execute(connection,
        `UPDATE categories SET active = 0 where catId = '${value}'`
    );
    if (rows.affectedRows) {
        return true;
    }

    return false;
}
async function getAll(value) {
    const rows = await dbCon.execute(connection,
        `SELECT * FROM categories where active = 1`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data,
    };
}

async function deactivate(values) {
    await values.map(async (value) => await setInactive(value));
    return true;
}

async function create(value) {
    // await dbCon.connection();
    const getCats = `SELECT * from categories where (catName='${value}' and id <> 0 and active = 1) `;
    let message = "Category is already exist";
    const records = await dbCon.execute(connection, getCats)
    if (records.length > 0) {
        return { message, data: [], created: false };
    }
    const randomString = 'CAT' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const query = `INSERT INTO categories
        (catId, catName, active) 
        VALUES 
        ('${randomString}', '${value}', 1)`
    const result = await dbCon.execute(connection, query);

    message = "Error in creating a category";

    if (result.affectedRows) {
        message = "Done";
        const allcats = await dbCon.execute(connection, `SELECT * FROM categories where active = 1`);

        return { message, data: helper.emptyOrRows(allcats), created: true };
    }

    return { message, data: [], created: false };
}

module.exports = {
    getAll,
    create,
    deactivate
};
