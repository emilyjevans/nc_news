# News API

## Project summary

This project is intended to be a news thread application similar to Reddit. The database hosts a number of articles and their respective comments, and users have the ability to add comments, increase or decrease votes on the articles and delete comments.

## Pre requisites

Node.js is required as the runtime environment for the project. Details on how to install node can be found [here](https://nodejs.org/en/download/current/).

Minimum version recommended for running this project: Node v16

Minimum version recommended for running this project: Postgres - v8.7.1

## Links

[Hosted version](https://whats-the-goss.herokuapp.com/)

[Front-end repository](https://github.com/emilyjevans/whats-the-goss)

[Hosted front-end](https://mystifying-einstein-e278c9.netlify.app)

## Instructions

Firstly, the project can be cloned from github via the following command:

### `git clone https://github.com/emilyjevans94/nc_news`

Change directory to the project's directory:

### `cd nc_news`

Install required dependencies:

### `npm install`

Create two .env files in the root directory:

### `touch .env.development`

and

### `touch .env.test`

Add database config to the .env files:

.env.development:

### `PGDATABASE = nc_news`

.env.test:

### `PGDATABASE = nc_news_test`

Seed local database:

### `npm run setup-dbs`

### `npm run seed`

Run tests:

### `npm run test`

Run server:

### `npm run start`
