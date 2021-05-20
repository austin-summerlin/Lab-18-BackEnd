/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import { formatSquirrels } from '../utils/munge-utils.js';
import request from 'superagent';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('Squirrel Stories');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

app.get('/api/me/favorites', async (req, res) => {

  try {
    const data = await client.query(`
    SELECT hectare, shift, date, story_topic_park_experience as "storyTopicParkExperience",
           story_topic_other_animals as "storyTopicOtherAnimals", story_topic_other as "storyTopicOther",
           story_topic_accidental_poems as "storyTopicAccidentalPoems"
    FROM   favorites
    WHERE  user_id = $1;
    `, [req.userId]);

    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ errror: err.message });
  }
});

app.get('/api/squirrel-sightings', async (req, res) => {
  // use SQL query to get data...
  try {
    const response = await request.get('https://data.cityofnewyork.us/resource/gfqj-f768.json?story_topic_accidental_poems=true');

    const transformedSquirrelData = formatSquirrels(response.body);

    // send back the data
    res.json(transformedSquirrelData);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default app;