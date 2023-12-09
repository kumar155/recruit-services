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
    await updateAuditStatus(obj);
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
        ('${obj.userId}', '${obj.jobId}', '${obj.type}', '${obj.comments}', '${formatted()}', '${obj.updated}');`
    }
    const result = await dbCon.execute(connection, query);
    let message = "Error in updating user status";
    if (result.affectedRows) {
        message = "candidate status updated successfully";
    }
    return { message };
}

async function updateAuditStatus(obj) {
    const date = new Date();
    const created = () => date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
    const query = `INSERT INTO
    candidatestatusaudit
     (userId, jobId, type, comments, created, updatedBy)
    VALUES
     ('${obj.userId}', '${obj.jobId}', '${obj.type}',
     '${obj.comments}', '${created()}', '${obj.updated}');`
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

async function statusAuditHistory({ userId, jobId }) {
    const query = `SELECT * FROM candidatestatusaudit
    where userId = '${userId}' and jobId='${jobId}'`;
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    return {
        data,
    };
}

module.exports = {
    setStatus,
    getStatus,
    statusAuditHistory
};
