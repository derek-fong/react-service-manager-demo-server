const has = require('has');
const sql = require('mssql');

/**
 * Get user by ID.
 * @param {string} id - User ID.
 * @returns {User} User with matching ID if found; `undefined` otherwise.
 */
async function getUserByIdAsync(id) {
  let user = undefined;

  if (id && typeof id === 'string') {
    const { recordset } = await sql.query`
      SELECT *
      FROM users
      WHERE id = ${id}
    `;

    if (recordset && recordset.length === 1) {
      user = recordset[0];
    }
  }

  return user;
}

module.exports = { getUserByIdAsync };
