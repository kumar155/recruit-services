const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require("jsonwebtoken");
const dbCon = require("../connection");
const getFileExtension = require("../utils/getFileExtension");
const formattedDateTime = require("../utils/getFormattedDateTime");
const logger = require("../config/logger-config");
const { sendNewEMail } = require("./emailService");

const connection = async () => await dbCon.connection();
async function getHistory(userId) {
    const query = `SELECT j.title, j.jobId, j.location, cj.created,
    cj.userId, cs.type, cs.comments, cs.created as statusCreated 
    FROM candidatejob as cj
    INNER JOIN jobs as j on cj.jobId=j.jobId
    LEFT JOIN candidatestatus as cs 
    ON cj.userId = cs.userId and j.jobId = cs.jobId where cj.userId = '${userId}'
    ORDER BY cj.created desc;`

    const statsQuery = `SELECT cs.type, COUNT(*) as count
    FROM candidatejob as cj
    INNER JOIN (SELECT DISTINCT userId, jobId, type, comments from candidatestatus) as cs
    ON cj.userId = cs.userId and cj.jobId = cs.jobId
    WHERE cj.userId = '${userId}'
    GROUP BY cs.type
    ORDER BY cs.type`;

    const rows = await dbCon.execute(connection, query);
    const stats = await dbCon.execute(connection, statsQuery);
    const data = helper.emptyOrRows(rows);
    return { data, stats: helper.emptyOrRows(stats) };
}

async function getProfile(userId) {
    const rows = await dbCon.execute(connection,
        `SELECT * from candidateprofile as cp INNER JOIN candidate as c on cp.userId = c.userId  where cp.userId = '${userId}' order by cp.created desc`
    );
    const data = helper.emptyOrRows(rows);
    return data[0] ? data[0] : { userId: userId };
}

async function checkIsAppliedJob(req, jobId) {
    const tokenData = req.headers.authorization.split(" ");
    const resp = jwt.decode(tokenData[1]);
    const query = `SELECT cj.created as appliedOn, cs.created as updatedOn, cs.type 
    FROM candidatejob as cj
    LEFT JOIN candidatestatus as cs
    ON cj.userId = cs.userId and cj.jobId = cs.jobId
    where (cj.userId = '${resp.user_id}' and cj.jobId = '${jobId}' and jobStatus=1)`;
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    return data.length > 0 ? data : null;
}

async function getAll(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await dbCon.execute(connection,
        `SELECT * FROM candidate`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

async function getSelection(id) {
    const result = await dbCon.execute(connection,
        `SELECT * FROM candidate WHERE id=${id}`
    );
    const data = helper.emptyOrRows(result);

    return {
        data,
    };
}

async function verifyCandidate(id) {
    const decodedName = Buffer.from(id, 'base64').toString('utf-8');
    const result = await dbCon.execute(connection,
        `UPDATE candidate SET
            active=1
            WHERE (userId='${decodedName}' AND id <> 0)`
    );

    if (result.affectedRows) {
        return { success: true };
    }
    return { success: false };
}

async function createStep1(user) {
    // sendNewEMail('Test123');
    const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
    let token = null;
    let message = "Error in creating user profile";
    const values = {
        email: user.email.trim(),
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
    }
    const isUserExists = await dbCon.execute(connection, `SELECT id from candidate where email='${values.email}'`);
    if (isUserExists.length > 0) {
        return { message: 'User already existing with the same email.', success: false };
    }
    const result = await dbCon.execute(connection,
        `INSERT INTO candidate 
    (userId, email, password, created, active, firstName, lastName) 
    VALUES 
    ('${randomString}', '${values.email}', '${user.password}','${formattedDateTime()}', 0, '${values.firstName}', '${values.lastName}')`
    );

    if (result.affectedRows) {
        token = jwt.sign(
            {
                user_id: randomString, email: user.email,
                name: values.firstName
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        message = "User profile created successfully";
        sendNewEMail(randomString);
    }

    return { message, next: 1, randomString, token, success: true };
}

async function createStep2(req, user) {
    const tokenData = req.headers.authorization.split(" ");
    const resp = jwt.decode(tokenData[1]);
    logger.info("create step2 for a job application process");
    let currentUserId = null;
    if (user.randomString) {
        currentUserId = user.randomString;
    } else if (resp.user_id) {
        currentUserId = resp.user_id;
    }
    const profile = `SELECT * from candidateprofile where userId='${currentUserId}' and id <> 0`;
    const rows = await dbCon.execute(connection, profile);
    const data = helper.emptyOrRows(rows);
    let message = '';
    if (data.length > 0) {
        const result = await dbCon.execute(connection,
            `UPDATE candidateprofile SET
            state = '${user.state}',
            phone1 = '${user.phone}',
            location = '${user.location}',
            experience = '${user.experience}',
            currentEmployer =  '${user.currentEmployer}',
            noticePeriod = '${user.noticePeriod}',
            updated = '${formattedDateTime()}'
            WHERE (userId='${currentUserId}' AND id <> 0)`);

        message = "Error in updating user profile";

        if (result.affectedRows) {
            message = "User data updated successfully";
        }

    } else {
        const result = await dbCon.execute(connection,
            `INSERT INTO candidateprofile 
        (userId, state, phone1, location, experience, currentEmployer, noticePeriod, created) 
        VALUES 
        ('${currentUserId}', '${user.state}', '${user.phone}', '${user.location}', '${user.experience}', '${user.currentEmployer}', '${user.noticePeriod}',  '${formattedDateTime()}')`
        );

        message = "Error in building user profile";

        if (result.affectedRows) {
            message = "User data saved successfully";
        }
    }

    return { message, next: 3 };
}

async function apply(req, user) {
    const tokenData = req.headers.authorization.split(" ");
    const resp = jwt.decode(tokenData[1]);
    let currentUserId = null;
    if (user.randomString) {
        currentUserId = user.randomString;
    } else if (resp.user_id) {
        currentUserId = resp.user_id;
    }
    let topSkills = [];
    user.primarySkills && user.primarySkills.forEach(skill => topSkills.push(skill.id));
    let skills = [];
    user.secondarySkills && user.secondarySkills.forEach(skill => skills.push(skill.id));
    let query = '';
    // user opts using existing resume
    if (user.useExistingResume) {
        query = `UPDATE candidateprofile 
            SET designation='${user.designation}', skills='${skills.join(',')}',
            topSkills='${topSkills.join(',')}', interestArea='${user.interestArea}',
            github='${user.github}', updated='${formattedDateTime()}'
            WHERE (userId='${currentUserId}' AND id <> 0)`;
    } else {
        const fileName = `${user.fileName}${getFileExtension(user.fileType)}`;
        // attchment updated
        query = `UPDATE candidateprofile 
            SET designation='${user.designation}', skills='${skills.join(',')}',
            topSkills='${topSkills.join(',')}', interestArea='${user.interestArea}',
            github='${user.github}', attachments='${fileName}',
            attachmentDateTime='${formattedDateTime()}', updated='${formattedDateTime()}'
            WHERE (userId='${currentUserId}' AND id <> 0)`;
    }
    const result = await dbCon.execute(connection, query);
    let message = "Error in building user profile";

    if (result.affectedRows) {
        return insertCandidateJob({ ...user, userId: resp.user_id });
        // message = "User data saved & applied to job successfully";
    }

    return { message, next: 2 };
}

async function insertCandidateJob(user) {
    // const tokenData = req.headers.authorization.split(" ");
    // const resp = jwt.decode(tokenData[1]);
    const randomString = 'CAN' + Math.random().toString(36).substr(2, 5).toUpperCase();
    // const result = {
    // affectedRows: null
    // };
    const result = await dbCon.execute(connection,
        `INSERT INTO candidatejob 
    (candidateJobId, jobId, active, userId, jobStatus, created) 
    VALUES 
    ('${randomString}', '${user.jobId}', 1, '${user.userId}' , 1, '${formattedDateTime()}')`
    );

    let message = "Error in applying job";

    if (result.affectedRows) {
        const createdBy = await dbCon.execute(connection,
            `SELECT postedBy from jobs where jobId = '${user.jobId}'`);

        const query = `INSERT INTO candidatestatusaudit
        (userId, jobId, type, comments, created, updatedBy)
        VALUES
        ( '${user.userId}', '${user.jobId}', 0, null, '${formattedDateTime()}', '${createdBy[0].postedBy}')`;
        await dbCon.execute(connection, query);
        const query2 = `INSERT INTO candidatestatus
        (userId, jobId, type, comments, created, updated)
        VALUES
        ( '${user.userId}', '${user.jobId}', 0, 'NA', '${formattedDateTime()}', '${createdBy[0].postedBy}')`;
        await dbCon.execute(connection, query2);
        message = "Job applied successfully!";
    }

    return { message, next: 1, randomString };
}
module.exports = {
    getAll,
    createStep1,
    createStep2,
    getSelection,
    apply,
    getHistory,
    getProfile,
    checkIsAppliedJob,
    verifyCandidate,
};
