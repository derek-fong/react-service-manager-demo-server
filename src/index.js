const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    testMessage: String!
  }
`;

const apolloServer = new ApolloServer({ typeDefs, mocks: true });

apolloServer
  .listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}. `);
  })
  .catch(error => console.error(error));
