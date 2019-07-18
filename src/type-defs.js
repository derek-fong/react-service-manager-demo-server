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
  Comment.
  """
  type Comment {
    """
    Comment ID.
    """
    id: ID!

    """
    Item ID that is comment is referring to.
    """
    referenceId: String!

    """
    Comment title.
    """
    title: String!

    """
    Comment description.
    """
    description: String!

    """
    Comment creation timestamp.
    """
    createdAt: DateTime!

    """
    Comment creator.
    """
    createdBy: User!
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

    """
    Request last update timestamp.
    """
    updatedAt: DateTime

    """
    Request last updater.
    """
    updatedBy: User
  }

  """
  Details required to create a comment.
  """
  input CreateCommentInput {
    """
    Item ID that is comment is referring to.
    """
    referenceId: String!

    """
    Comment title.
    """
    title: String!

    """
    Comment description.
    """
    description: String!
  }

  """
  Details required to create a new request.
  """
  input CreateRequestInput {
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

  """
  Details required to update an existing request.
  """
  input UpdateRequestInput {
    """
    Request ID.
    """
    id: ID!

    """
    Request title.
    """
    title: String

    """
    Request description.
    """
    description: String

    """
    Request status.
    """
    status: Status
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

    """
    Get request comments.
    """
    requestComments(referenceId: String!): [Comment]!
  }

  type Mutation {
    """
    Create a new comment.
    """
    createComment(createCommentInput: CreateCommentInput!): Comment!

    """
    Create a new request.
    """
    createRequest(createRequestInput: CreateRequestInput!): Request!

    """
    Update an existing request.
    """
    updateRequest(updateRequestInput: UpdateRequestInput!): Request!
  }
`;
