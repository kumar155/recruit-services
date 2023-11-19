const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const jwt = require("jsonwebtoken");
const dbCon = require("../connection");

const date = new Date();
const formatted = () => date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];

const connection = async () => await dbCon.connection();
async function getHistory(userId) {
    const query = `SELECT j.title, j.jobId, j.location, cj.created, cj.userId FROM recruit.candidatejob as cj
    inner join recruit.jobs as j on cj.jobId=j.jobId where userId = '${userId}';`
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    return { data };
}

async function getProfile(userId) {
    const rows = await dbCon.execute(connection,
        `SELECT * from candidateprofile as cp INNER JOIN candidate as c on cp.userId = c.userId  where cp.userId = '${userId}' order by cp.created desc`
    );
    const data = helper.emptyOrRows(rows);
    return data[0] ? data[0] : null;
}

async function checkIsAppliedJob(req, jobId) {
    const tokenData = req.headers.authorization.split(" ");
    const resp = jwt.decode(tokenData[1]);
    const rows = await dbCon.execute(connection,
        `SELECT * from candidatejob where (userId = '${resp.user_id}' and jobId = '${jobId}' and jobStatus=1)`
    );
    const data = helper.emptyOrRows(rows);
    return data.length > 0 ? { candidateJobId: data[0].candidateJobId, created: data[0].created } : null;
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

async function createStep1(user) {
    const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
    let token = null;
    const result = await dbCon.execute(connection,
        `INSERT INTO candidate 
    (userId, email, password, created, active, firstName, lastName) 
    VALUES 
    ('${randomString}', '${user.email}', '${user.password}','${formatted()}', 0, '${user.firstName}', '${user.lastName}')`
    );

    let message = "Error in creating user profile";

    if (result.affectedRows) {
        token = jwt.sign(
            { user_id: randomString, email: user.email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        message = "User profile created successfully";
    }

    return { message, next: 1, randomString, token };
}

async function createStep2(req, user) {
    const tokenData = req.headers.authorization.split(" ");
    const resp = jwt.decode(tokenData[1]);
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
            updated = '${formatted()}'
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
        ('${currentUserId}', '${user.state}', '${user.phone}', '${user.location}', '${user.experience}', '${user.currentEmployer}', '${user.noticePeriod}',  '${formatted()}')`
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
    const query = `UPDATE candidateprofile 
    SET designation='${user.designation}', skills='${skills.join(',')}',
    topSkills='${topSkills.join(',')}', interestArea='${user.interestArea}',
    github='${user.github}', updated='${formatted()}'
    WHERE (userId='${currentUserId}' AND id <> 0)`;
    const result = await dbCon.execute(connection, query);

    let message = "Error in building user profile";

    if (result.affectedRows) {
        message = "User data saved & applied to job successfully";
    }

    return { message, next: 3 };
}

async function update(id, programmingLanguage) {
    const result = await dbCon.execute(connection,
        `UPDATE programming_languages 
    SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
    pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
    WHERE id=${id}`
    );

    let message = "Error in updating programming language";

    if (result.affectedRows) {
        message = "Programming language updated successfully";
    }

    return { message };
}

async function remove(id) {
    const result = await dbCon.execute(connection,
        `DELETE FROM programming_languages WHERE id=${id}`
    );

    let message = "Error in deleting programming language";

    if (result.affectedRows) {
        message = "Programming language deleted successfully";
    }

    return { message };
}

module.exports = {
    getAll,
    createStep1,
    createStep2,
    update,
    remove,
    getSelection,
    apply,
    getHistory,
    getProfile,
    checkIsAppliedJob,
};
