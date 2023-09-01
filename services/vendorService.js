const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const moment = require('moment');

async function getAll(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
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
    const result = await db.query(
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
    const datecreated = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');
    const date = new Date();
    const formatted = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
    const result = await db.query(
        `INSERT INTO jobs 
        (jobId, title, location, persona, positions, category, skills, active, created) 
        VALUES 
        ('${id}', '${job.title}', '${job.location}', '${job.persona}', '${job.positions}', '${job.category}',
        '${job.skills}',0, '${formatted}')`
    );

    let message = "Error in creating a job";

    if (result.affectedRows) {
        message = "Details submitted successfully!";
    }

    return { message, next: 1, randomString: id };
}

async function createStep2(job) {
    const result = await db.query(
        `UPDATE jobs 
    SET description='${job.description}'
    WHERE (jobId='${job.jobId}' AND id <> 0)`);

    let message = "Error creating job description";

    if (result.affectedRows) {
        message = "Job description saved successfully";
    }

    return { message, next: 2 };
}

async function publish(user) {
    let responsibilities = '';
    user.values && user.values.forEach(skill => {
        responsibilities = `${responsibilities}<$>${skill.value}`;
    });
    const query = `UPDATE jobs
        SET responsibilities='${responsibilities}'
        WHERE (jobId='${user.jobId}' AND id <> 0)`;
    const result = await db.query(query);

    let message = "Error in publishing a job positions";

    if (result.affectedRows) {
        message = "Job posted successfully!";
    }

    return { message, next: 3 };
}

async function update(id, programmingLanguage) {
    const result = await db.query(
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
    const result = await db.query(
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
    publish
};
