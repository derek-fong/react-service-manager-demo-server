const { ApolloServer } = require('apollo-server');

const connectMsSqlAsync = require('./mssql-connector');
const environment = require('./environment');
const resolvers = require('./resolvers');
const typeDefs = require('./type-defs');

(async () => {
  try {
    await connectMsSqlAsync({
      database: environment.database.msSql.database,
      password: environment.database.msSql.password,
      server: environment.database.msSql.server,
      user: environment.database.msSql.user
    });

    const apolloServer = new ApolloServer({
      resolvers,
      typeDefs,
      introspection: environment.apollo.introspection,
      playground: environment.apollo.playground
    });
    const { url } = await apolloServer.listen({ port: environment.port });
    console.log(`Server ready at ${url}. `);
  } catch (error) {
    console.error(error);
  }
})();
