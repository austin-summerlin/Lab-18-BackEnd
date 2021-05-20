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
    SELECT id, hectare, shift, date, stories, experience, poems
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

app.post('/api/favorites', async (req, res) => {
  try {
    const favorite = req.body;

    const data = await client.query(`
      INSERT INTO favorites (hectare, shift, date, stories, experience, poems, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, hectare, shift, date, stories, experience, poems;
      `, [favorite.hectare, favorite.shift, favorite.date, favorite.stories, favorite.experience, favorite.poems, req.userId]);


    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const data = await client.query(`
    DELETE FROM favorites
    WHERE       id = $1
    AND         user_id = $2
    RETURNING   id, hectare, shift, date, stories, experience, poems;
    `, [req.params.id, req.userId]);
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });

  }
});

export default app;