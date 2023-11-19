const db = require("./db");
const helper = require("../helper");
const jwt = require("jsonwebtoken");
const inhouse = require("../data/users.json");
const dbCon = require("../connection");

const connection = async () => await dbCon.connection();

async function login(user) {
    // await dbCon.connection();
    const result = await dbCon.execute(connection,
        `SELECT userId, active, firstName, lastName from candidate 
    WHERE (email = '${user.loginemail}' and password='${user.loginpassword}' and id <> 0)`
    );

    const data = helper.emptyOrRows(result);
    if (data.length > 0) {
        const currentUser = data[0];
        const profiles = await dbCon.execute(connection,
            `SELECT * from candidateprofile where (userId = '${currentUser.userId}' and id <> 0) order by created desc`
        )
        const token = jwt.sign(
            { user_id: data[0].userId, email: data[0].email, type: 'candidate', name: currentUser.firstName },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        return {
            token,
            data: data[0],
            profile: profiles[0],
            success: true
        };
    }

    throw new Error('Invalid Credentials');
}

async function recruiterLogin(user) {
    // await dbCon.connection();
    const result = await dbCon.execute(connection,
        `SELECT userId, active, firstName, lastName from vendor WHERE (email = '${user.loginemail}' and password='${user.loginpassword}' and id <> 0)`
    );
    const data = helper.emptyOrRows(result);
    if (data.length > 0) {
        const currentUser = data[0];
        const token = jwt.sign(
            { user_id: currentUser.userId, email: currentUser.email, type: 'vendor', name: currentUser.firstName },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        return {
            token,
            data: currentUser,
            profile: currentUser,
            success: true
        };
    }
    throw new Error('Invalid Credentials');
}

module.exports = {
    login,
    recruiterLogin,
};
