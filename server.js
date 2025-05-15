require('dotenv').config();
const express=  require('express');
const app= express();
const port = 5500;
const path= require('path');
const userRoutes= require('./routes/usersRoute');
const mongoose= require('mongoose');
const boardRoutes= require('./routes/boardsRoute');
const cardRoutes= require('./routes/cardsRoute');
const columnRoutes= require('./routes/columnsRoute');
const subtaskRoutes= require('./routes/subtasksRoute');
const refreshTokenRoutes= require('./routes/refreshTokenRoute');
const authenticateUser= require('./auth/authenticateUsers');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const mimeTypes = require('mime-types');
app.use(cors(corsOptions))


app.use(express.json());
app.use('/api/users',userRoutes);
app.use('/api/boards', authenticateUser, boardRoutes);
app.use('/api/cards',authenticateUser, cardRoutes);
app.use('/api/columns', authenticateUser, columnRoutes);
app.use('/api/subtasks', authenticateUser, subtaskRoutes);
app.use('/api/', refreshTokenRoutes);


//Use the client app
app.use(express.static(path.join(__dirname, '/client/dist'), {
  setHeaders: (res, path) => {
    const mimeType = mimeTypes.lookup(path);
    console.log(`Path: ${path}, MimeType: ${mimeType}`);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
  }
}));
//Render client

app.get('*', (req, res)=>{

    res.sendFile(path.join(__dirname,'/client/dist/index.html'))
})
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", ()=>{
    console.log('connected to mongodb')
})



app.listen(port, ()=>{
    console.log('Server is running on port ', port);
})