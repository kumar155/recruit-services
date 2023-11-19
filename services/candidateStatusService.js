const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require("jsonwebtoken");
const dbCon = require("../connection");

const date = new Date();
const formatted = () => date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];

const connection = async () => await dbCon.connection();

async function setStatus(obj) {
    const query = `INSERT INTO candidateStatus
    (userId, jobId, type, comments, created, updated)
    VALUES
    ('${obj.userId}', '${obj.jobId}', '0', 'none', '${formatted()}', '${obj.updated}');`
    const result = await dbCon.execute(connection, query);
    let message = "Error in creating user profile";
    if (result.affectedRows) {
        message = "candidate status updated successfully";
    }
    return { message };
}

async function getStatus({ userId, jobId }) {
    const rows = await dbCon.execute(connection,
        `SELECT * from candidateStatus where userId = '${userId}' and jobId='${jobId}';`
    );
    const data = helper.emptyOrRows(rows);
    return data[0] ? data[0] : null;
}

module.exports = {
    setStatus,
    getStatus
};
