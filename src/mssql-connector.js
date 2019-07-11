const sql = require('mssql');

const { initDbAsync } = require('./utils/init-db');

module.exports = async function(dbConfig) {
  await sql.connect(dbConfig);
  await initDbAsync();
  // Close the SQL connection on Node process ends,
  const handleGracefulExit = () => {
    sql.close();
  };

  process.on('SIGINT', handleGracefulExit).on('SIGTERM', handleGracefulExit);

  sql.on('error', error => {
    console.error(error);
  });
};
