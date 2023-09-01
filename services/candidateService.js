const db = require("./db");
const helper = require("../helper");
const config = require("../config");

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

async function createStep1(user) {
    const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
    const date = new Date();
    const formatted = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
    const result = await db.query(
        `INSERT INTO candidate 
    (userId, email, password, created, active) 
    VALUES 
    ('${randomString}', '${user.email}', '${user.password}','${formatted}', 0)`
    );

    let message = "Error in creating user profile";

    if (result.affectedRows) {
        message = "User profile created successfully";
    }

    return { message, next: 1, randomString };
}

async function createStep2(user) {
    const result = await db.query(
        `INSERT INTO candidateprofile 
    (userId, state, phone1, location, experience, currentEmployer, noticePeriod, created) 
    VALUES 
    ('${user.randomString}', '${user.state}', '${user.phone}', '${user.location}', '${user.experience}', '${user.currentEmployer}', '${user.noticePeriod}',  '2023-08-04 17:01:51')`
    );

    let message = "Error in building user profile";

    if (result.affectedRows) {
        message = "User data saved successfully";
    }

    return { message, next: 3 };
}

async function apply(user) {
    let topSkills = [];
    user.primarySkills && user.primarySkills.forEach(skill => topSkills.push(skill.text));
    let skills = [];
    user.secondarySkills && user.secondarySkills.forEach(skill => skills.push(skill.text));
    const query = `UPDATE candidateprofile 
    SET designation='${user.designation}', skills='${skills.join(',')}', topSkills='${topSkills.join(',')}', interestArea='${user.interestArea}', github='${user.github}'
    WHERE (userId='${user.randomString}' AND id <> 0)`;
    const result = await db.query(query);

    let message = "Error in building user profile";

    if (result.affectedRows) {
        message = "User data saved & applied to job successfully";
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
    apply
};
