
# News API 

The hosted version of the app can be found [here](https://whats-the-goss.herokuapp.com/).

## Project summary 

This project is intended to be an news thread application similar to Reddit. The database hosts a number of articles and their respective comments, and users have the ability to add comments, increase or decrease votes on the articles and delete comments. 

## Instructions 

The project can be cloned from github via the following command:

```git clone https://github.com/emilyjevans94/nc_news```

Install dependencies:

```npm install```

Seed local database: 

```npm run seed```

Run tests: 

```npm run test```

Create two .env files: 

In the main directory, two files will be needed called '.env.development' and '.env.test' 
The contents of these will be of the form 'PGDATABASE = ' and the name of the database to be connected to. 


## Minimum versions required 
Node.js - v16.7.0 
Postgres - v8.7.1