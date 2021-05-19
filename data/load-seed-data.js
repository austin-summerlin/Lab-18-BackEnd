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
        INSERT INTO squirrels (hectare, shift, date, note_squirrel_park_stories,  story_topic_accidental_poems, story_topic_other, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [squirrel.hectare, squirrel.shift, squirrel.date, squirrel.note_squirrel_park_stories, squirrel.story_topic_accidental_poems, squirrel.story_topic_other, user.id]);
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