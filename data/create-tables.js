/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE squirrels (
        hectare SERIAL PRIMARY KEY NOT NULL,
        shift VARCHAR(512) NOT NULL,
        date VARCHAR(128) NOT NULL,
        note_squirrel_park_stories VARCHAR(1024) NOT NULL,
        story_topic_park_experience BOOLEAN NOT NULL,
        story_topic_squirrel BOOLEAN NOT NULL,
        story_topic_other_animals BOOLEAN NOT NULL,
        story_topic_dogs BOOLEAN NOT NULL,
        story_topic_accidental_poems BOOLEAN,
        story_topic_other VARCHAR(128) NOT NULL,


      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}