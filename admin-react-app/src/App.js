import { Amplify } from 'aws-amplify';
// import { SidePanel } from '@aws-amplify/ui-react';
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
import {updateTodo, deleteTodo} from './graphql/mutations';
import { listTodos, getTodo } from './graphql/queries';
import awsExports from "./aws-exports";
import "./App.css"

Amplify.configure(awsExports);

const initialState = { id: '', name: '', email: '', phone: '', address: '', dob: '', job_title: '', department_name: '', department_id: '' }

function App({ signOut, user }) {
  const [todos, setTodos] = useState([]);
  const [currentUser, setCurrentUser] = useState(initialState);
  const [showPanel, setShowPanel] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  const handleClick = async(ID) => {
    const userData = await API.graphql(graphqlOperation(getTodo, {id: ID}))
    const data = userData.data.getTodo
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

  const handleUpdate = async() => {
    await API.graphql(graphqlOperation(updateTodo, {input: currentUser}))
    window.location.reload(false);
  }

  const handleDelete = async() => {
    await API.graphql(graphqlOperation(deleteTodo, {input: {id: currentUser.id}}))
    window.location.reload(false);
  }

  // const handleChange = (event, key) => {
  //   const value = event.target.value;
  //   setCurrentUser(prevState => ({ ...prevState, [key]: value }));
  // };

  // const closePanel = () => {
  //   setShowPanel(false);
  // }

  return (
    <div>
      <div>
        <button onClick={signOut}>Sign out</button>
      </div>
      <br/>
      <br/>
      
      <Table style={{width: "50%"}}
        caption=""
        highlightOnHover={true}
        size="small"
        variation="bordered">
        <ScrollView width="400px" height="500px" maxWidth="100%">
        <TableHead>
          <TableRow>
            <TableCell as="th">Employee ID</TableCell>
            <TableCell as="th">Name</TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {
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

{showPanel && (
<div class="side-panel">
<div >
<h3>{"Edit Employee Details"}</h3>
<div>
<label htmlFor="name">Name:</label>
<input id="name" type="text" value={currentUser.name} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} />
</div>
<div>
<label htmlFor="email">Email:</label>
<input id="email" type="email" value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} />
</div>
<div>
<label htmlFor="phone">Phone:</label>
<input id="phone" type="text" value={currentUser.phone} onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})} />
</div>
<div>
<label htmlFor="address">Address:</label>
<textarea id="address" value={currentUser.address} onChange={(e) => setCurrentUser({...currentUser, address: e.target.value})} />
</div>
<div>
<label htmlFor="dob">Date of birth:</label>
<input id="dob" type="date" value={currentUser.dob} onChange={(e) => setCurrentUser({...currentUser, dob: e.target.value})} />
</div>
<div>
<label htmlFor="job_title">Job Title:</label>
<input id="job_title" type="text" value={currentUser.job_title} onChange={(e) => setCurrentUser({...currentUser, job_title: e.target.value})} />
</div>
<div>
<label htmlFor="department_name">Department Name:</label>
<input id="department_name" type="text" value={currentUser.department_name} onChange={(e) => setCurrentUser({...currentUser, department_name: e.target.value})} />
</div>
<div>
<label htmlFor="department_id">Department ID:</label>
<input id="department_id" type="text" value={currentUser.department_id} onChange={(e) => setCurrentUser({...currentUser, department_id: e.target.value})} />
</div>
<br />
<div class= "Actions">
<button onClick={() => handleUpdate()}>Save</button>&nbsp;
<button onClick={() => handleShow()}>Delete</button>&nbsp;
<button onClick={() => setShowPanel(false)}>Close</button>
</div>
</div>
</div>
)}
{show && (<Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">Are you sure you want to delete the record?</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete() }>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>)}
</div>
);
}

export default withAuthenticator(App);
