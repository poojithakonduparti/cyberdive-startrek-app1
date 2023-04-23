const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

// Import your schema and resolvers
const typeDefs = require('../schema.json');
const resolvers = require('../resolvers');

// Construct a new ApolloServer instance with your schema and resolvers
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

// Create a test client to send requests to your API
const { query, mutate } = createTestClient(server);

describe('AppSync GraphQL API tests', () => {
  test('fetch list', async () => {
    const GET_LIST_QUERY = gql`
      query GetList {
        list {
          id
          name
          description
        }
      }
    `;
    const response = await query({ query: GET_LIST_QUERY });
    expect(response.errors).toBeUndefined();
    expect(response.data.list).toBeDefined();
    expect(response.data.list.length).toBeGreaterThan(0);
  });

  test('fetch item by ID', async () => {
    const GET_ITEM_QUERY = gql`
      query GetItemById($id: ID!) {
        item(id: $id) {
          id
          name
          description
        }
      }
    `;
    const id = uuidv4();
    const response = await query({ query: GET_ITEM_QUERY, variables: { id } });
    expect(response.errors).toBeUndefined();
    expect(response.data.item).toBeNull();
  });

  test('create item', async () => {
    const CREATE_ITEM_MUTATION = gql`
      mutation CreateItem($input: ItemInput!) {
        createItem(input: $input) {
          id
          name
          description
        }
      }
    `;
    const input = {
      name: 'Test Item',
      description: 'This is a test item',
    };
    const response = await mutate({ mutation: CREATE_ITEM_MUTATION, variables: { input } });
    expect(response.errors).toBeUndefined();
    expect(response.data.createItem).toBeDefined();
    expect(response.data.createItem.name).toEqual(input.name);
    expect(response.data.createItem.description).toEqual(input.description);
  });

  test('delete item by ID', async () => {
    const DELETE_ITEM_MUTATION = gql`
      mutation DeleteItem($id: ID!) {
        deleteItem(id: $id)
      }
    `;
    const id = uuidv4();
    const response = await mutate({ mutation: DELETE_ITEM_MUTATION, variables: { id } });
    expect(response.errors).toBeUndefined();
    expect(response.data.deleteItem).toEqual(true);
  });
});
