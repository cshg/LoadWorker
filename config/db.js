const connection = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.APP_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8',
  },
};

const knex = require('knex')(connection);

connection.database = process.env.APP_NAME;

const db = require('bookshelf')(knex);

module.exports = db;
