/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      name
      email
      phone
      address
      dob
      job_title
      department_name
      department_id
      id
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        name
        email
        phone
        address
        dob
        job_title
        department_name
        department_id
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
