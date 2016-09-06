# Basic ionic2 login/register demo.

## Description
This is a basic ionic2 implementation with a simple node express server to signup and login.

## How to use ?

- open terminal and run ionic serve
- open new terminal tab and run mongod --dbpath /absolute/path/to/repo/backend/data/
- open terminal tab and run mongo to enter the mongo shell
- use <your database name>
- open new terminal tab and run either node server.js or nodemon server.js

( see backend/actions/methods.js file for REST Api endpoints and use Postman to test )

## Changelog
This is a JsonWebToken based authentication. Login/Logout is being showed on the same page, depending on auth status.

I tried to implement redux-thunk. Not working though...