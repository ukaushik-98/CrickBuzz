const express = require('express');
const morgan = require('morgan');
const { SERVER } = require('./config')

const app = express();
const PORT = process.env.PORT || SERVER.PORT;

app.use(express.json({extended: false}));
app.use(morgan('dev'));

app.listen(PORT, () =>  console.log(`Server started on port ${PORT}`));

//routes
app.get('/health-check', (req,res) => {res.send('API Running')});   // Health Route - make sure API is Running
// app.use('/api/users', require('./routes/api/users'));   // Users Route
// app.use('/api/auth', require('./routes/api/auth'));     // Authentication + Token generation route
// app.use('/api/hunts', require('./routes/api/hunts'));   // Hunts Route