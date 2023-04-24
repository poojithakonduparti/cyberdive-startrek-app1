import { deleteById, getSingle, update, get } from '../App';
import { API } from 'aws-amplify';

import { updateTodo as updateMutations, deleteTodo as deleteMutation} from '../graphql/mutations';
import { getTodo as getQuery, listTodos as listQuery} from '../graphql/queries';

describe("your test suite", () => {
    window.URL.createObjectURL = jest.fn();
  
    afterEach(() => {
      window.URL.createObjectURL.mockReset();
    });

jest.mock('@aws-amplify/ui-react/styles.css', () => ({}));

const mockGraphql = jest.fn();

beforeEach(() => {
    API.graphql = mockGraphql
});

afterEach(() => {
    jest.clearAllMocks()
});

it('should update employee details', () => {
    const todo = {name: 'test name 2', email: 'testemail@gmail.com', phone: '1234567890', address: 'test address', dob: '01-01-1999', job_title: 'test job description', department_name: 'test department', department_id: 'test dept id' }

    update(todo)

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toEqual(
        { query: updateMutations, variables: { input: todo } }
    );
})

it('should delete employee record', () => {
    const current_id = 'test-id'

    deleteById(current_id)

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toStrictEqual(
        { query: deleteMutation, variables: { input: {id: current_id }} }
    );
})

it('should fetch deatils of selected employee', () => {
    const current_id = 'test-id'

    getSingle(current_id)

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toEqual(
        { query: getQuery, variables: { id: current_id } }
    );
})

it('should fetch deatils of all employees', () => {

    get()

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toMatchObject(
        { query: listQuery }
    );
})

})