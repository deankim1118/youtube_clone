import express from 'express';
import { home, search } from '../controllers/videoController';
import { publicOnlyMiddleware } from '../middlewares';
import {
  getJoin,
  login,
  postJoin,
  getLogin,
  postLogin,
} from '../controllers/userController';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route('/login')
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get('/search', search);

// export default rootRouter;
module.exports = rootRouter;
