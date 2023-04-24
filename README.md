# Startrek-Flyhigh: Admin Portal

![Webinar-pana](https://user-images.githubusercontent.com/46862684/229015820-c303a49e-dd60-4381-a77a-165e0f9aa562.svg)

----- 

> ✅ Active status <br>


----- 

## Index
  - [Objective 🎯](#objective)
  - [Abstract 📝](#abstract)
  - [Architecture Diagram 🏗](#architecture-diagram)
  - [Project Components 💽](#project-components)
    - [AWS AppSync GraphQL API](#AppSync)
    - [AWS DynamoDB ](#DynamoDB)
    - [AWS Amplify](#Amplify)
    - [React](#React)


  - [How to run the application 💻](#how-to-run-the-application-locally)
  - [How to run the tests ](#how-to-run-tests)
----- 

## Objective
Build an Admin Portal using Amplify and React where the admins of Startrek-Flyhigh can easily view, update and delete their information to [DynamoDB](https://aws.amazon.com/dynamodb/#:~:text=Amazon%20DynamoDB%20is%20a%20fully,data%20import%20and%20export%20tools.). This app allows authenticated users to use it through AWS Cognito.Provides access to update, delete and view employee details using [AppSync]


## Abstract
The task involves building a decoupled architecture for the Flyhigh-Startrek Employee Survey Portal:

- Login Page for Authentication
- Home Page to view the table of Employees containing Employee Name and ID
- Side Panel to edit the selected Employee Information
- Delete Confirmation pop up 
- Auto Update the Employee Table in **real time** on the Admin Portal when a new employee record is added from Employee Survey Portal


## Architecture Diagram
![Architecture](https://github.com/poojithakonduparti/cyberdive-startrek-app1/blob/amplify/admin-react-app/images/admin_portal_architecture.png?raw=true)


## Project Components

### AppSync

AWS AppSync is a fully managed service that simplifies the development of real-time data-driven applications by providing an easy way to securely integrate with multiple data sources and automatically scale as the application grows. For the purpose of this project, AppSync has been implemented to perform the **update**, **delete**, **view**, **list** mutations and queries to the database.
> View Employee Data
> Update Employee Data
> Delete Employee Data


The Admin Portal gets updated without **refresh** whenever a new employee record is inserted through the Employee Survey Portal into the table. This is made possible by using AppSync APIs to truly ensure decoupling between two applications. The **subscriptions** provided by AppSync are leveraged to make this possible.


### DynamoDB
Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability, making it ideal for applications that require low latency data access at any scale. DynamoDB has been used in this project to store employee data like ID, Name, Phone Number, Email, Job Title, Department Name, etc.

The Employee Information is gathered and will be stored in the Database with a *primary key** - ID. Any operations in the Admin Portal will require this ID to perform update or delete functionalities.


### Amplify
AWS Amplify is a development platform that provides a set of tools and services for building scalable and secure cloud-powered web and mobile applications, enabling developers to focus on the front-end development and easily integrate with backend services such as authentication, storage, and APIs. 
The Web App for the users has been built using Amplify UI Libraries. This displays Employee Table, provides sign in and sign out buttons, side panels and alerts. It also provides integration to AppSync and DynamoDB.

### React
React is a powerful JavaScript library designed for creating dynamic and interactive user interfaces. By breaking down the UI into reusable components, React enables developers to build complex applications in a modular and efficient way, with faster rendering and better performance compared to traditional approaches. Its popularity has made it one of the most widely used front-end development tools in the industry.

React has been used widely in the project to build the frontend. The form styles and components of the application have been built by leveraging React.

## How to run the application locally

1. Clone the repo to get all the source code on your machine

2. Within the cyberdive-startrek-app2/admin-react-app/  folder, go to your terminal and run

                  npm install
        
Note: This will add all the required dependencies and modules to the project in your local

###Warning for Windows Users:

Head to the `package.json` file in the directory, and change `script` from `PORT=<your-desired-port> react-scripts-start` to `react-scripts-start --port=<your-desired-port>`

The `package.json` included in the repository works for Mac users


3. Execute the React Web App by running the command in your terminal

                 npm run start


In case the ports specified in the `package.json` are already taken, you will have to say yes to the prompt for running it on a different port. You can continue running it on a different port by typing yes.

5. Access application through the port you just opened!

## How to run tests

Backend testing for the API has been setup, frontend testing has been done through extensive validation checks on the frontend. In order to run the tests, go to your terminal and run the following command

                  npm run test
