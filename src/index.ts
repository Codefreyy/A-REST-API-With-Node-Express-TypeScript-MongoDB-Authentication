import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
require('dotenv').config()

const app = express();
app.use(cors({
    credentials: true
}));

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser())

const server = http.createServer(app)

server.listen(8080, () => {
    console.log('Server is running on port 8080')
})

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@joyyujiepengcluster.wlnfm3v.mongodb.net/test?retryWrites=true&w=majority`

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error) => {
    console.log(error)
    process.exit(1)
})

app.use('/', router())