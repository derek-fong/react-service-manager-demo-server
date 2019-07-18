const defaultPort = 4000;

module.exports = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true'
  },
  database: {
    msSql: {
      database: process.env.DATABASE_MSSQL_DATABASE,
      password: process.env.DATABASE_MSSQL_PASSWORD,
      server: process.env.DATABASE_MSSQL_SERVER,
      user: process.env.DATABASE_MSSQL_USER
    }
  },
  fakeCurrentUserId: process.env.FAKE_CURRENT_USER_ID,
  port: process.env.PORT || defaultPort
};
