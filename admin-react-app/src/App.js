// Importing required packages
import { Amplify } from 'aws-amplify';
import { Modal, Button } from "react-bootstrap";
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  ScrollView
} from '@aws-amplify/ui-react';
import { onCreateTodo } from './graphql/subscriptions';
import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { updateTodo, deleteTodo } from './graphql/mutations';
import { listTodos, getTodo } from './graphql/queries';
import awsExports from "./aws-exports";
import "./App.css"

// Initializing Amplify with aws-exports configuration
Amplify.configure(awsExports);

const initialState = { id: '', name: '', email: '', phone: '', address: '', dob: '', job_title: '', department_name: '', department_id: '' }

// Functions for updating, deleting, and fetching user details using GraphQL operations
export async function update(currentUser) {
  const updateData = await API.graphql(graphqlOperation(updateTodo, { input: currentUser }))
  return updateData
}

export async function deleteById(id) {
  return await API.graphql({ query: deleteTodo, variables: { input: { id } } });
}

export async function getSingle(ID) {
  const userData = await API.graphql(graphqlOperation(getTodo, { id: ID }))
  return userData;
}

export async function get() {
  const apiData = await API.graphql(graphqlOperation(listTodos))
  return apiData;
}

function App({ signOut, user }) {
  const [todos, setTodos] = useState([]);
  const [currentUser, setCurrentUser] = useState(initialState);
  const [showPanel, setShowPanel] = useState(false);
  const [show, setShow] = useState(false);
  // Function to close the modal
  const handleClose = () => setShow(false);
  // Function to show the modal
  const handleShow = () => setShow(true);
  // Fetching details from GraphQL API and subscribing to onCreateTodo subscription
  useEffect(() => {
    fetchTodos()
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (todoData) => {
        const newTodo = todoData.value.data.onCreateTodo;
        setTodos([...todos, newTodo]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [todos]);

  // Function to fetch employee details from GraphQL API
  async function fetchTodos() {
    try {
      const todoData = await get()
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching details') }
  }

  // Function to fetch employee data from GraphQL API
  const handleClick = async (ID) => {
    const out = await getSingle(ID)
    const data = out.data.getTodo
    const updatedUser = {
      id: ID,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dob: data.dob,
      job_title: data.job_title,
      department_name: data.department_name,
      department_id: data.department_id
    };
    setCurrentUser(updatedUser);
    setShowPanel(true);
  }

  // Function to update user data
  const handleUpdate = async () => {
    update(currentUser)
    alert('Updated Successfully!')
    window.location.reload(false);
  }
  // Function to delete user data
  const handleDelete = async () => {
    await deleteById(currentUser.id);
    window.location.reload(false);
  }

  return (
    <div>
      <div>
        <button data-testid="sign-out-button" className="signout-btn" onClick={signOut}>Sign out</button>
      </div>
      {/* Table component to display employee data */}
      <Table className="table-component" style={{ width: "50%" }}
        caption=""
        highlightOnHover={true}
        size="small"
        variation="bordered">
        <ScrollView width="400px" height="500px" maxWidth="100%">
          <TableHead>
            {/* Header row of table */}
            <TableRow className='table-row'>
              <TableCell as="th">Employee ID</TableCell>
              <TableCell as="th">Name</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              // Map over each employee record in the array and display it as a row in the table
              todos.map((todo, index) => (
                <TableRow key={index} onClick={() => handleClick(todo.id)}>
                  <TableCell>{todo.id}</TableCell>
                  <TableCell>{todo.name}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </ScrollView>
      </Table>

      {/* Side panel for editing employee details */}
      {showPanel && (
        <div class="side-panel">
          <div >
            <h3>{"Edit Employee Details"}</h3>
            <div>
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" value={currentUser.name} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="phone">Phone:</label>
              <input id="phone" type="text" value={currentUser.phone} onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })} />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <textarea id="address" value={currentUser.address} onChange={(e) => setCurrentUser({ ...currentUser, address: e.target.value })} />
            </div>
            <div>
              <label htmlFor="dob">Date of birth:</label>
              <input id="dob" type="date" value={currentUser.dob} onChange={(e) => setCurrentUser({ ...currentUser, dob: e.target.value })} />
            </div>
            <div>
              <label htmlFor="job_title">Job Title:</label>
              <input id="job_title" type="text" value={currentUser.job_title} onChange={(e) => setCurrentUser({ ...currentUser, job_title: e.target.value })} />
            </div>
            <div>
              <label htmlFor="department_name">Department Name:</label>
              <input id="department_name" type="text" value={currentUser.department_name} onChange={(e) => setCurrentUser({ ...currentUser, department_name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="department_id">Department ID:</label>
              <input id="department_id" type="text" value={currentUser.department_id} onChange={(e) => setCurrentUser({ ...currentUser, department_id: e.target.value })} />
            </div>
            <br />
            {/* This is the section for the Actions, which includes three buttons - Save, Delete, and Close. */}
            <div class="Actions">
              <button onClick={() => handleUpdate()}>Save</button>&nbsp;
              <button onClick={() => handleShow()}>Delete</button>&nbsp;
              <button onClick={() => setShowPanel(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {show && (
        <>
          <div className="modal-overlay"></div>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            className="custom-modal"
          >
            <Modal.Header className="custom-modal-header">
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            {/* This is the body section of the modal box, which includes the message for the user. */}
            <Modal.Body className="custom-modal-body">
              <div className="alert alert-danger">
                Are you sure you want to delete the record?
              </div>
            </Modal.Body>
            {/* This is the footer section of the modal box, which includes two buttons - Cancel and Delete. */}
            <Modal.Footer className="custom-modal-footer">
              <Button variant="default" onClick={handleClose} className="custom-modal-cancel-button">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete()} className="custom-modal-delete-button">
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}

export default withAuthenticator(App);
