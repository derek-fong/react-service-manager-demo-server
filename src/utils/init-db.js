const sql = require('mssql');

const { createCommentsAsync } = require('../comments.service');
const { fakeCurrentUserId } = require('../environment');

// Utilities to initialize database.

/**
 * Create `comments` table.
 */
async function createCommentsTableAsync() {
  const createCommentsTable = `
    IF (
      NOT EXISTS (
        SELECT *
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'dbo' AND
              TABLE_NAME = 'comments'
      )
    )
    BEGIN
      CREATE TABLE comments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(300) NOT NULL,
        reference_id VARCHAR(20) NOT NULL,
        created_at DATETIME NOT NULL,
        creator_id VARCHAR(12) NOT NULL FOREIGN KEY REFERENCES users (id)
          ON DELETE NO ACTION
          ON UPDAtE NO ACTION
      )
    END
  `;

  await sql.query(createCommentsTable);
}

/**
 * Create `requests` table.
 */
async function createRequestsTableAsync() {
  const createRequestsTable = `
    IF (
      NOT EXISTS (
        SELECT *
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'dbo' AND
              TABLE_NAME = 'requests'
      )
    )
    BEGIN
      CREATE TABLE requests (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(100) NOT NULL,
        status VARCHAR(30) NOT NULL,
        created_at DATETIME NOT NULL,
        creator_id VARCHAR(12) NOT NULL FOREIGN KEY REFERENCES users (id)
          ON DELETE NO ACTION
          ON UPDAtE NO ACTION,
        updated_at DATETIME,
        updater_id VARCHAR(12) FOREIGN KEY REFERENCES users (id)
          ON DELETE NO ACTION
          ON UPDAtE NO ACTION
      )
    END
  `;

  await sql.query(createRequestsTable);
}

/**
 * Add mock requests if `requests` table is empty.
 */
async function addMockRequestsAsync() {
  const now = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  const addMockRequests = `
    IF(
      (SELECT count(*) FROM requests) = 0
    )
    BEGIN
      INSERT INTO requests (
        title,
        description,
        status,
        created_at,
        creator_id
      )
      VALUES
        ('Test Request 1', 'Test request 1', 'REGISTERED', '${now}','${fakeCurrentUserId}'),
        ('Test Request 2', 'Test request 2', 'IN_PROGRESS', '${now}', '${fakeCurrentUserId}'),
        ('Test Request 3', 'Test request 3', 'PENDING_CUSTOMER', '${now}', '${fakeCurrentUserId}'),
        ('Test Request 4', 'Test request 4', 'FULFILLED', '${now}', '${fakeCurrentUserId}')
    END
  `;

  const { rowsAffected } = await sql.query(addMockRequests);

  if (rowsAffected && rowsAffected.length > 0) {
    await createCommentsAsync([
      {
        title: 'Created Request',
        description: 'Request has been created',
        referenceId: '1'
      },
      {
        title: 'Updated Request Status',
        description: `Request status set to "REGISTERED". `,
        referenceId: '1'
      },
      {
        title: 'Created Request',
        description: 'Request has been created',
        referenceId: '2'
      },
      {
        title: 'Updated Request Status',
        description: `Request status set to "IN_PROGRESS". `,
        referenceId: '2'
      },
      {
        title: 'Created Request',
        description: 'Request has been created',
        referenceId: '3'
      },
      {
        title: 'Updated Request Status',
        description: `Request status set to "PENDING_CUSTOMER". `,
        referenceId: '3'
      },
      {
        title: 'Created Request',
        description: 'Request has been created',
        referenceId: '4'
      },
      {
        title: 'Updated Request Status',
        description: `Request status set to "FULFILLED". `,
        referenceId: '4'
      }
    ]);
  }
}

/**
 * Create `users` table.
 */
async function createUsersTableAsync() {
  const createUsersTable = `
    IF (
      NOT EXISTS (
        SELECT *
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'dbo' AND
              TABLE_NAME = 'users'
      )
    )
    BEGIN
      CREATE TABLE users (
        id VARCHAR(12) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL
      )
    END
  `;

  await sql.query(createUsersTable);
}

/**
 * Add mock users if `users` table is empty.
 */
async function addMockUsersAsync() {
  const addMockUsers = `
    IF(
      (SELECT count(*) FROM users) = 0
    )
    BEGIN
      INSERT INTO users (id, first_name, last_name)
      VALUES
        ('he123456', 'Foo', 'Bar'),
        ('he987654', 'John', 'Smith')
    END
  `;

  await sql.query(addMockUsers);
}

/**
 * Initialize database.
 * Creates `users` and `requests` table if not exist.
 * Populate tables with mock data if empty.
 */
async function initDbAsync() {
  await createUsersTableAsync();
  await addMockUsersAsync();
  await createCommentsTableAsync();
  await createRequestsTableAsync();
  await addMockRequestsAsync();
}

module.exports = { initDbAsync };
