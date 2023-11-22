const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require("jsonwebtoken");
const dbCon = require("../connection");

const date = new Date();
const formatted = () => date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];

const connection = async () => await dbCon.connection();

async function setStatus(obj) {
    let query;
    const status = await getStatus({ userId: obj.userId, jobId: obj.jobId });
    if (status !== null) {
        query = `UPDATE candidatestatus SET
        type = '${obj.type}',
        comments='${obj.comments}',
        created='${formatted()}',
        updated='${obj.updated}'
        WHERE userId = '${obj.userId}' and jobId='${obj.jobId}'`;
    } else {
        query = `INSERT INTO candidatestatus
        (userId, jobId, type, comments, created, updated)
        VALUES
        ('${obj.userId}', '${obj.jobId}', '${obj.type}', 'none', '${formatted()}', '${obj.updated}');`
    }
    const result = await dbCon.execute(connection, query);
    let message = "Error in updating user status";
    if (result.affectedRows) {
        message = "candidate status updated successfully";
    }
    return { message };
}

async function getStatus({ userId, jobId }) {
    const rows = await dbCon.execute(connection,
        `SELECT * from candidatestatus where userId = '${userId}' and jobId='${jobId}';`
    );
    const data = helper.emptyOrRows(rows);
    return data[0] ? data[0] : null;
}

module.exports = {
    setStatus,
    getStatus
};
