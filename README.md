# Basic ionic2 login/register demo.

## Description
This is a basic ionic2 implementation with a simple node express server. Ionic2 app implements the redux architecture with angular2-redux package. It's possible to signup, login, show statements (served from the node server), select clients and update statements data filtered by selected client accordingly.

## How to use ?

- open terminal and run ionic serve
- open new terminal tab and run mongod --dbpath /absolute/path/to/repo/backend/data/
- open terminal tab and run mongo to enter the mongo shell
- use <your database name>
- open new terminal tab and run either node server.js or nodemon server.js

( see backend/actions/methods.js file for REST Api endpoints and use Postman to test )

## Changelog
This is a JsonWebToken based authentication. Login/Logout is being showed on the same page, depending on auth status.

angular2-redux package, based upon the https://github.com/InfomediaLtd/angular2-redux-example working.

Statements serve via node server. Statements page working, filter by client selector, ordered by title.

http://localhost:3333/statements returns json array of statement items.

http://localhost:3333/statements?clientId=1 => filters by clientId

http://localhost:3333/statements?orderby=id|title => order by id or title

