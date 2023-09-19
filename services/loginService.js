const db = require("./db");
const helper = require("../helper");
const jwt = require("jsonwebtoken");

async function login(user) {
    const result = await db.query(
        `SELECT userId, active, firstName, lastName from candidate 
    WHERE (email = '${user.loginemail}' and password='${user.loginpassword}' and id <> 0)`
    );

    const data = helper.emptyOrRows(result);
    if (data.length > 0) {
        const token = jwt.sign(
            { user_id: result.userId, email: result.email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        return {
            token,
            data: data[0],
            success: true
        };
    }

    return {
        success: false
    };
}

module.exports = {
    login
};
