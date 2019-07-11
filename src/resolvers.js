const { GraphQLDateTime } = require('graphql-iso-date');

const {
  createRequestAsync,
  getAllRequestsAsync,
  getRequestByIdAsync
} = require('./requests.service');
const { getUserByIdAsync } = require('./users.service');

module.exports = {
  DateTime: GraphQLDateTime,
  Request: {
    createdAt: ({ created_at }) => created_at,
    createdBy: ({ creator_id }) => getUserByIdAsync(creator_id)
  },
  User: {
    firstName: ({ first_name }) => first_name,
    lastName: ({ last_name }) => last_name
  },
  Query: {
    allRequests: getAllRequestsAsync,
    request: (obj, { id }) => getRequestByIdAsync(id)
  },
  Mutation: {
    createRequest: (obj, { requestInput }) => createRequestAsync(requestInput)
  }
};