const { UserInputError } = require('apollo-server');
const sql = require('mssql');

// Using a mock user ID for demo purpose only.
const mockCurrentUserId = 'he123456';

/**
 * Create request.
 * @param {RequestInput} requestInput - Request input. Contains `title`, `description` and `status`.
 * @returns {Request} New request.
 */
async function createRequestAsync({ title, description, status }) {
  if (
    title &&
    typeof title === 'string' &&
    description &&
    typeof description === 'string' &&
    status &&
    typeof status === 'string'
  ) {
    const creatorId = 'he123456';
    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const createRequest = `
      INSERT INTO requests (
        title,
        description,
        status,
        created_at,
        creator_id
      )
      VALUES ('${title}', '${description}', '${status}', '${now}', '${creatorId}')
      SELECT SCOPE_IDENTITY() as id
    `;
    const { recordset } = await sql.query(createRequest);

    return getRequestByIdAsync(`${recordset[0].id}`);
  }
}

/**
 * Get all requests.
 * @returns {Request[]} All Requests.
 */
async function getAllRequestsAsync() {
  const { recordset } = await sql.query`SELECT * FROM requests`;

  return recordset && recordset.length > 0 ? recordset : [];
}

/**
 * Get request by ID.
 * @param {string} id - Request ID.
 * @returns {Request} Request with matching ID if found; `undefined` otherwise.
 */
async function getRequestByIdAsync(id) {
  let request = undefined;

  if (id && typeof id === 'string') {
    const { recordset } = await sql.query`
      SELECT *
      FROM requests
      WHERE id = ${id}
    `;

    if (recordset && recordset.length === 1) {
      request = recordset[0];
    }
  }

  return request;
}

/**
 * Update request.
 * @param {UpdateRequestInput} UpdateRequestInput - Details required to update a request.
 * @returns {Request} Updated request.
 */
async function updateRequestAsync({ description, id, status, title }) {
  const previousRequest = await getRequestByIdAsync(id);

  if (!previousRequest) {
    throw new UserInputError(`Request with ID: ${id} not found. `);
  }

  let columnsToUpdate = [];

  if (description && description !== previousRequest.description) {
    columnsToUpdate.push(`description = '${description}'`);
  }

  if (status && status !== previousRequest.status) {
    columnsToUpdate.push(`status = '${status}'`);
  }

  if (title && title !== previousRequest.title) {
    columnsToUpdate.push(`title = '${title}'`);
  }

  if (columnsToUpdate.length === 0) {
    throw new UserInputError('Invalid update request input. ');
  }

  const now = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  columnsToUpdate.push(`updated_at = '${now}'`);
  columnsToUpdate.push(`updater_id = '${mockCurrentUserId}'`);

  const updateRequest = `
    UPDATE requests
    SET ${columnsToUpdate.join(', ')}
    WHERE id = ${id}
  `;

  await sql.query(updateRequest);

  return getRequestByIdAsync(id);
}

module.exports = {
  createRequestAsync,
  getAllRequestsAsync,
  getRequestByIdAsync,
  updateRequestAsync
};
