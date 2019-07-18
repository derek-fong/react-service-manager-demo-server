const { UserInputError } = require('apollo-server');
const sql = require('mssql');

const { createCommentsAsync } = require('./comments.service');
const { fakeCurrentUserId } = require('./environment');

/**
 * Create request.
 * @param {CreateRequestInput} createRequestInput - Details required to create a request.
 * @returns {Request} A new request.
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
    const creatorId = fakeCurrentUserId;
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
    const requestId = `${recordset[0].id}`;

    await createCommentsAsync([
      {
        title: 'Created Request',
        description: 'Request has been created. ',
        referenceId: requestId
      },
      {
        title: 'Updated Request Status',
        description: `Request status set to "${status}". `,
        referenceId: requestId
      }
    ]);

    return getRequestByIdAsync(requestId);
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
 * @param {UpdateRequestInput} updateRequestInput - Details required to update a request.
 * @returns {Request} Updated request.
 */
async function updateRequestAsync({ description, id, status, title }) {
  const previousRequest = await getRequestByIdAsync(id);

  if (!previousRequest) {
    throw new UserInputError(`Request with ID: ${id} not found. `);
  }

  let columnsToUpdate = [];
  let comments = [];

  if (title && title !== previousRequest.title) {
    columnsToUpdate.push(`title = '${title}'`);
    comments.push({
      title: 'Updated Request Title',
      description: `Request title changed from "${previousRequest.title}" to "${title}". `,
      referenceId: `${id}`
    });
  }

  if (description && description !== previousRequest.description) {
    columnsToUpdate.push(`description = '${description}'`);
    comments.push({
      title: 'Updated Request Description',
      description: `Request Description changed from "${previousRequest.description}" to "${description}". `,
      referenceId: `${id}`
    });
  }

  if (status && status !== previousRequest.status) {
    columnsToUpdate.push(`status = '${status}'`);
    comments.push({
      title: 'Updated Request Status',
      description: `Request status changed from "${previousRequest.status}" to "${status}". `,
      referenceId: `${id}`
    });
  }

  if (columnsToUpdate.length === 0) {
    throw new UserInputError('Invalid update request input. ');
  }

  const now = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  columnsToUpdate.push(`updated_at = '${now}'`);
  columnsToUpdate.push(`updater_id = '${fakeCurrentUserId}'`);

  const updateRequest = `
    UPDATE requests
    SET ${columnsToUpdate.join(', ')}
    WHERE id = ${id}
  `;

  await sql.query(updateRequest);
  await createCommentsAsync(comments);

  return getRequestByIdAsync(id);
}

module.exports = {
  createRequestAsync,
  getAllRequestsAsync,
  getRequestByIdAsync,
  updateRequestAsync
};
