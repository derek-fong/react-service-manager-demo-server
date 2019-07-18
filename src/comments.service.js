const sql = require('mssql');

const { fakeCurrentUserId } = require('./environment');

/**
 * Create comment.
 * @param {CreateCommentInput} createCommentInput - Details required to create a comment.
 * @returns {Comment} A new comment.
 */
async function createCommentAsync({ description, title, referenceId }) {
  if (
    description &&
    typeof description === 'string' &&
    referenceId &&
    typeof referenceId === 'string' &&
    title &&
    typeof title === 'string'
  ) {
    const creatorId = fakeCurrentUserId;
    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const createComment = `
      INSERT INTO comments (
        title,
        description,
        reference_id,
        created_at,
        creator_id
      )
      VALUES ('${title}', '${description}', '${referenceId}', '${now}', '${creatorId}')
      SELECT SCOPE_IDENTITY() as id
    `;

    const { recordset } = await sql.query(createComment);

    return getCommentByIdAsync(`${recordset[0].id}`);
  }
}

/**
 * Get comment by ID.
 * @param {string} id - Comment ID.
 * @returns {Comment} Comment with matching ID if found; `undefined` otherwise.
 */
async function getCommentByIdAsync(id) {
  let comment = undefined;

  if (id && typeof id === 'string') {
    const { recordset } = await sql.query`
      SELECT *
      FROM comments
      WHERE id = ${id}
    `;

    if (recordset && recordset.length === 1) {
      comment = recordset[0];
    }
  }

  return comment;
}

/**
 * Create comments.
 * @param {CreateCommentInputs} createCommentInputs - Details required to create comments.
 */
async function createCommentsAsync(createCommentInputs) {
  if (
    createCommentInputs &&
    createCommentInputs.constructor === Array &&
    createCommentInputs.length > 0
  ) {
    const creatorId = fakeCurrentUserId;
    let comments = [];

    createCommentInputs.forEach(({ description, title, referenceId }) => {
      const now = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      comments.push(
        `('${title}', '${description}', '${referenceId}', '${now}', '${creatorId}')`
      );
    });

    const createComments = `
      INSERT INTO comments (
        title,
        description,
        reference_id,
        created_at,
        creator_id
      )
      VALUES ${comments.join(',')}
    `;

    await sql.query(createComments);
  }
}

/**
 * Get comments by reference ID.
 * @param {string} referenceId - Reference ID.
 * @returns {Comment[]} Comments with matching reference IDs if found; `undefined` otherwise.
 */
async function getCommentsByReferenceIdAsync(referenceId) {
  let comments = [];

  if (referenceId && typeof referenceId === 'string') {
    const getCommentsByReferenceId = `
      SELECT *
      FROM comments
      WHERE reference_id = '${referenceId}'
      ORDER BY id DESC
    `;

    const { recordset } = await sql.query(getCommentsByReferenceId);

    if (recordset && recordset.length > 0) {
      comments = recordset;
    }
  }

  return comments;
}

module.exports = {
  createCommentAsync,
  createCommentsAsync,
  getCommentsByReferenceIdAsync
};
