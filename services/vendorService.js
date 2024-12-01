const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const moment = require('moment');
const formatString = require("../utils/formatString");
const dbCon = require("../connection");
const formattedDateTime = require("../utils/getFormattedDateTime");

const connection = async () => await dbCon.connection();
async function getAll(id) {
    const query = `SELECT j.title, j.jobId, j.location,
        j.active, j.created, COUNT(cj.candidateJobId) as responses
        FROM recruit.jobs j
        LEFT JOIN
        recruit.candidatejob cj
        ON j.jobId = cj.jobId
        where j.postedBy='${id}'
        GROUP BY j.title, j.jobId, j.location, j.active, j.created
        ORDER BY j.created desc`;
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    const innerQuery = `SELECT res.jobId, cs.type from (${query}) as res
                INNER JOIN candidatestatus as cs
                ON res.jobId = cs.jobId`;
    const result = await dbCon.execute(connection, innerQuery);
    const innerRows = helper.emptyOrRows(result);
    return {
        data,
        innerRows,
    };
}

async function getStatusTypeHistory(vendorid, typeid) {
    const query = `SELECT DISTINCT j.title, cj.jobId, j.location, j.active, j.created
    from candidatejob as cj
    INNER JOIN candidatestatus as cs
    INNER JOIN jobs as j
    ON j.jobId = cj.jobId and cj.jobId = cs.jobId and cj.userId = cs.userId
    WHERE cs.type = ${typeid} and j.active = 1 and j.postedBy = '${vendorid}'
    ORDER BY j.created desc`;
    const rows = await dbCon.execute(connection, query);
    const data = helper.emptyOrRows(rows);
    const innerQuery = `SELECT res.jobId, cs.type from (${query}) as res
                INNER JOIN candidatestatus as cs
                ON res.jobId = cs.jobId and cs.type = ${typeid}`;
    const result = await dbCon.execute(connection, innerQuery);
    const innerRows = helper.emptyOrRows(result);
    return {
        data,
        innerRows,
    };
}

async function getAppliedCandidates(id, type) {
    const query = `SELECT result.userId, result.jobId, result.created, result.firstName,
        result.primaryskills,
        result.secondary,
        result.score,
        result.keywords,
        result.summary,
        cs.type, cs.comments, cs.created as statusCreated from 
            (SELECT cj.userId, cj.jobId, cj.created,
                cj.matchScore as score,
                cj.missingKeyWords as keywords,
                cj.summary,
                ct.firstName,
                cp.topSkills as primaryskills, cp.skills as secondary
            FROM candidatejob as cj
            INNER JOIN
                candidateprofile as cp
                ON cj.userId = cp.userId
            INNER JOIN
                candidate as ct
                ON cj.userId = ct.userId
            where cj.jobId='${id}' and cj.jobStatus =1) as result
    LEFT JOIN candidatestatus as cs
    ON result.userId = cs.userId and result.jobId = cs.jobId`;
    const orderCaluse = `order by result.created asc`;
    let conQuery = `${query} ${orderCaluse}`;
    if (type) {
        const whereClause = `WHERE cs.type=${type}`;
        conQuery = `${query} ${whereClause} ${orderCaluse}`;
    }
    const rows = await dbCon.execute(connection, conQuery);
    const data = helper.emptyOrRows(rows);
    return {
        data,
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

async function createStep1(job) {
    const randomString = Math.floor(Math.random() * 90000) + 10000;
    const id = `POS${randomString}`;
    // const datecreated = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');
    let primarySkills = [];
    job.primarySkills && job.primarySkills.forEach(skill => primarySkills.push(skill.id));
    let secondarySkills = [];
    job.secondarySkills && job.secondarySkills.forEach(skill => secondarySkills.push(skill.id));
    const result = await dbCon.execute(connection,
        `INSERT INTO jobs 
        (jobId, title, location, persona, positions, category, skills, secondarySkills, active, created, postedBy) 
        VALUES 
        ('${id}', '${job.title}', '${job.location}', '${job.persona}', '${job.positions}', '${job.category}',
        '${primarySkills.join(',')}', '${secondarySkills.join(',')}',0, '${formattedDateTime()}', '${job.postedBy}')`
    );

    let message = "Error in creating a job";

    if (result.affectedRows) {
        message = "Details submitted successfully!";
    }

    return { message, next: 1, randomString: id };
}

async function createSkills(job) {
    let primarySkills = [];
    job.primary && job.primary.forEach(skill => primarySkills.push(skill.id));
    let secondarySkills = [];
    job.secondary && job.secondary.forEach(skill => secondarySkills.push(skill.id));
    const result = await dbCon.execute(connection,
        `UPDATE jobs 
    SET skills='${primarySkills.join(',')}', secondarySkills='${secondarySkills.join(',')}'
    WHERE (jobId='${job.jobId}' AND id <> 0)`);

    let message = "Error creating job skills";

    if (result.affectedRows) {
        message = "Job skills saved successfully";
    }

    return { message, next: 2 };
}

async function publishNewJob(job) {
    let responsibilities = '';
    const formattedDesc = formatString(job.description);
    job.responsibilities && job.responsibilities.forEach(resp => {
        responsibilities = `${responsibilities}<$>${resp.value}`;
    });
    const result = await dbCon.execute(connection, `UPDATE jobs 
        SET description='${formattedDesc}',
        plainText='${job.plainText}',
        responsibilities='${JSON.stringify(responsibilities)}',
        active = 1
        WHERE (jobId='${job.jobId}' AND id <> 0)`);

    let message = "Error creating job description";

    if (result.affectedRows) {
        message = "Job description saved and published successfully";
    }

    return { message, next: 2 };
}

async function responsibilities(user) {
    let responsibilities = '';
    user.values && user.values.forEach(skill => {
        responsibilities = `${responsibilities}<$>${skill.value}`;
    });
    const query = `UPDATE jobs
        SET responsibilities='${JSON.stringify(responsibilities)}'
        WHERE (jobId='${user.jobId}' AND id <> 0)`;
    const result = await dbCon.execute(connection, query);

    let message = "Error in responsibilities to a job position";

    if (result.affectedRows) {
        message = "Job responsibilities updated successfully!";
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

async function makeActive(id) {
    const result = await dbCon.execute(connection,
        `UPDATE jobs SET active=1 where jobId='${id}' and id <> 0`
    );

    let message = "Error in updating the job status";

    if (result.affectedRows) {
        message = "Job activated successfully";
    }

    return { message };
}

async function makeInactive(id) {
    const result = await dbCon.execute(connection,
        `UPDATE jobs SET active=0 where jobId='${id}' and id <> 0`
    );

    let message = "Error in updating the job status";

    if (result.affectedRows) {
        message = "Job de-activated successfully";
    }

    return { message };
}

async function onboardNewAdmin(user) {
    const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
    const result = await dbCon.execute(connection,
        `INSERT INTO vendor 
    (userId, email, password, created, firstName, lastName, active) 
    VALUES 
    ('${randomString}', '${user.email}', '${user.password}','${formattedDateTime()}', '${user.firstName}', '${user.lastName}', 1)`
    );

    let message = "Error in creating admin profile";

    if (result.affectedRows) {
        message = "User profile created successfully";
    }

    return { message };
}

module.exports = {
    getAll,
    createStep1,
    update,
    remove,
    getSelection,
    responsibilities,
    makeActive,
    makeInactive,
    getAppliedCandidates,
    getStatusTypeHistory,
    createSkills,
    publishNewJob,
    onboardNewAdmin,
};
