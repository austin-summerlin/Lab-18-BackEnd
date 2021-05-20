/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import squirrels from './squirrels.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
          [user.name, user.email, user.password]);
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      squirrels.map(squirrel => {
        return client.query(`
        INSERT INTO favorites (hectare, shift, date, stories, experience, poems, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [squirrel.hectare, squirrel.shift, squirrel.date, squirrel.stories, squirrel.experience, squirrel.poems, user.id]);
      })
    );


    console.log('seed data load complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}