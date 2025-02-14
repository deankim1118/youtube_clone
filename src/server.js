import express from 'express';
import morgan from 'morgan';
import flash from 'express-flash';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import apiRouter from './routers/apiRouter';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { localsMiddleware } from './middlewares';

const app = express();
const logger = morgan('dev');
// Middleware는 request에 응답하는 함수가 아니라, request를 지연시키고 작업을 다음 함수로 넘겨주는 함수이다.
// app.use를 사용하면 모든 Routes 에서 Middleware가 실행된다.
// dotenv.config({ path: './.env' });

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');
app.use(logger);
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // save only I create or modify the sessions
    cookie: {
      maxAge: 2000000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);
app.use('/api', apiRouter);

export default app;
