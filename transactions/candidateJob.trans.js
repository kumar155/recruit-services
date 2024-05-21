const dbCon = require("../connection");

const connection = async () => await dbCon.connection();

async function insertResumeAnalysis(body, MLresponse) {
    const candidateJobId = body.candidateJobId;
    const query = `UPDATE candidatejob SET 
     matchScore='${MLresponse['JD Match']}',
     missingKeyWords='${MLresponse['Missing Keywords'].join(',')}',
     summary='${MLresponse['Profile Summary']}'
     WHERE (candidateJobId='${candidateJobId}' AND id <> 0)`;

    const result = await dbCon.execute(connection, query);
    let message = 'error occured while analysing the resume';
    if (result.affectedRows) {
        message = 'Uploaded and resume metrics generated successfully';
    }

    return { message };
}

module.exports = {
    insertResumeAnalysis,
};