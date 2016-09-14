# Basic ionic2 login/register demo.

## Description
This is a basic ionic2 implementation with a simple node express server. Ionic2 app implements the ngrx/store architecture with ngrx/store package. It's possible to signup, login, show statements (served from the node server), select clients and update statements data filtered by selected client accordingly.

## How to use ?

Node server (serving static json data)

- npm install

- cd backend/
- mongod --dbpath /absolute/path/to/repo/backend/data/ (in new terminal tab)

optional:
- mongo (in new tab, to enter the mongo shell)
- use ionic-bmg (to select database)

- nodemon server.js ( or node server.js) (in new terminal tab )
- cd ../ (back to package.json directory)
- ionic serve

( see backend/actions/methods.js file for REST Api endpoints and use Postman to test )

## Changelog
This is a JsonWebToken based authentication.
Login/Logout is being showed on the same page, depending on auth status.

ngrx/store package, based upon

http://onehungrymind.com/build-better-angular-2-application-redux-ngrx/
https://github.com/btroncone/ngrx-examples
https://gist.github.com/btroncone/a6e4347326749f938510#slicing-state-for-views

- Statements serve via node server.
- Statements page working
- filter by client selector, ordered by title.

http://localhost:3333/statements returns json array of statement items.

http://localhost:3333/statements?clientId=1 => filters by clientId

http://localhost:3333/statements?orderby=id|title => order by id or title

