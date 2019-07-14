const { gql } = require('apollo-server');

module.exports = gql`
  scalar DateTime

  """
  Status type.
  """
  enum Status {
    """
    Item has been completed.
    """
    CLOSED

    """
    Item has been fulfilled.
    """
    FULFILLED

    """
    Item is currently being actioned.
    """
    IN_PROGRESS

    """
    Item is awaiting for customer's feedback.
    """
    PENDING_CUSTOMER

    """
    Item has been registered.
    """
    REGISTERED
  }

  """
  User.
  """
  type User {
    """
    User ID.
    """
    id: ID!

    """
    First name.
    """
    firstName: String!

    """
    last name.
    """
    lastName: String!
  }

  """
  Request.
  """
  type Request {
    """
    Request ID.
    """
    id: ID!

    """
    Request title.
    """
    title: String!

    """
    Request description.
    """
    description: String!

    """
    Request status.
    """
    status: Status!

    """
    Request creation timestamp.
    """
    createdAt: DateTime!

    """
    Request creator.
    """
    createdBy: User!
  }

  """
  Details required for creating new requests.
  """
  input RequestInput {
    """
    Request title.
    """
    title: String!

    """
    Request description.
    """
    description: String!

    """
    Request status.
    """
    status: Status!
  }

  type Query {
    """
    Get all requests.
    """
    allRequests: [Request]!

    """
    Get request by ID.
    """
    request(id: ID!): Request
  }

  type Mutation {
    """
    Create a new request.
    """
    createRequest(requestInput: RequestInput!): Request!
  }
`;
