const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const dbCon = require("../connection");

async function getMultiple(page = 1) {
  await dbCon.connection();
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await dbCon.execute(
    `SELECT * FROM candidate`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function create(programmingLanguage) {
  await dbCon.connection();
  const result = await dbCon.execute(
    `INSERT INTO programming_languages 
    (name, released_year, githut_rank, pypl_rank, tiobe_rank) 
    VALUES 
    ("${programmingLanguage.name}", ${programmingLanguage.released_year}, ${programmingLanguage.githut_rank}, ${programmingLanguage.pypl_rank}, ${programmingLanguage.tiobe_rank})`
  );

  let message = "Error in creating programming language";

  if (result.affectedRows) {
    message = "Programming language created successfully";
  }

  return { message };
}

async function update(id, programmingLanguage) {
  await dbCon.connection();
  const result = await dbCon.execute(
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
  await dbCon.connection();
  const result = await dbCon.execute(
    `DELETE FROM programming_languages WHERE id=${id}`
  );

  let message = "Error in deleting programming language";

  if (result.affectedRows) {
    message = "Programming language deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
