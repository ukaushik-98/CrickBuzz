const express = require('express');
const morgan = require('morgan');
const { SERVER } = require('./config');

// ROUTES
const admin = require('./routes/admin');
const matches = require('./routes/matches');
const players = require('./routes/players');
const teams = require('./routes/teams');

const app = express();
const PORT = process.env.PORT || SERVER.PORT;

app.use(express.json({extended: false}));
app.use(morgan('dev'));

app.listen(PORT, () =>  console.log(`Server started on port ${PORT}`));

//routes
app.get('/health-check', (req,res) => {res.send('API Running')});   // Health Route - make sure API is Running
app.use('/api/admin', admin);   // Users Route
app.use('/api/matches', matches);   // Users Route
app.use('/api/players', players);   // Users Route
app.use('/api/teams', teams);   // Users Route
// app.use('/api/auth', require('./routes/api/auth'));     // Authentication + Token generation route