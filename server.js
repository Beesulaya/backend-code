// backend/srver.js
const express = require('express');
const mongoose = require('mongoose');
const idGenerationRoutes = require('./routes/idGenerationRoutes');
const studentRoutes = require('./routes/routeStudentReg');
const Clientroutes = require('./routes/routeUser')
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));


app.use('/api/id-generation', idGenerationRoutes);
app.use('/api/student', studentRoutes);
app.use('/', Clientroutes);

const PORT = process.env.PORT || 1992;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

