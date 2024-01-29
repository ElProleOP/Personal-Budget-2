# Personal budget - 2
Simple Node/Express API to manage a portfolio budget using a budget envelope strategy. Users can create, read, update, and delete envelopes as well as create transactions for each individual envelope. All data is persisted in a database using PostgreSQL.

## Running the app
To run locally, run `npm install`, then `npm start`

Once the app is running locally, you can access the API at `http://localhost:8080/`

## Testing with Swagger
Swagger documentation and testing available at `http://localhost:8080/api/docs`

To test with Swagger:

### Envelopes:
----
 - Retrieve envelopes using `GET /api/envelopes`
 - Retrieve a single envelope using `GET /api/envelopes/{id}`
 - Create an envelope using `POST /api/envelopes`
 - Update an envelope using `PUT /api/envelopes/{id}`
 - Delete an envelope using `DELETE /api/envelopes/{id}`
 - Delete all envelopes using `DELETE /api/envelopes`
 - Create an envelope transaction using `POST /api/envelopes/transfer/{from}/{to}`

### Transactions:
___
 - Retrieve transactions using `GET /api/transactions`
 - Retrieve a single transaction using `GET /api/transactions/{id}`
 - Delete a transaction using `DELETE /api/transactions/{id}`
 - Delete all transactions using `DELETE /api/transactions`

## Project Objectives

 - Build an API using Node.js and Express
 - Be able to create, read, update, and delete envelopes and transactions
 - Use Postman to test API endpoints
 - Writing tests with Supertest 

## Technology
Project is created with:
 - ES6 Javascript
 - Node.js
 - Express.js
 - Postgresql
 - Swagger

## Source
This project was part of the challenge from the Back-End path by Codecademy. 