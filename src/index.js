const { ApolloServer } = require('apollo-server');

const environment = require('./environment');
const typeDefs = require('./type-defs');

const apolloServer = new ApolloServer({
  typeDefs,
  introspection: environment.apollo.introspection,
  mocks: true,
  playground: environment.apollo.playground
});

apolloServer
  .listen({ port: environment.port })
  .then(({ url }) => {
    console.log(`Server ready at ${url}. `);
  })
  .catch(error => console.error(error));
