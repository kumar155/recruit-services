const logger = require("../config/logger-config");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();

async function insertResumeAnalysis(body, MLresponse) {
    const candidateJobId = body.candidateJobId;
    logger.info('response of the resume AI analysis: %s', MLresponse);
    const query = `UPDATE candidatejob SET 
     matchScore='${MLresponse['JD Match']}',
     missingKeyWords='${MLresponse['Missing Keywords'].join(',')}',
     summary='${MLresponse['Profile Summary']}'
     WHERE (candidateJobId='${candidateJobId}' AND id <> 0)`;

    const result = await dbCon.execute(connection, query);
    logger.info('query response of sql: %s', result);
    let message = 'error occured while analysing the resume';
    if (result.affectedRows) {
        message = 'Uploaded and resume metrics generated successfully';
    }
    logger.info('query affected rows: %s', result);

    return { message };
}

module.exports = {
    insertResumeAnalysis,
};