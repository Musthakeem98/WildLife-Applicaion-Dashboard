const express = require('express');
const bodyParser = require('body-parser');
const connectToMongoDB = require('./libs/connectToMongoDB');
const complainsRouter = require('./routes/complain_route');
const task = require('./routes/task');
const userRouter = require('./routes/user_routes')
const login = require('./routes/login_route')
const officerLogin = require('./routes/officer_login')
const beta_officer_filter = require('./routes/beta_officer_filter')
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectToMongoDB().then(() => {
  app.use(cors())
  app.use('/complaints', complainsRouter);
  app.use('/user', userRouter);
  app.use('/task', task)
  app.use('/userLogin',login)
  app.use('/officerLogin', officerLogin);
  app.use('/filterbeta', beta_officer_filter)
  

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
