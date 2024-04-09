import express from 'express';
import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares';
import {
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
// Add Regular Expression (\\d+) to get only NUMBER Id
userRouter.get('/:id(\\d+)', see);

// export default userRouter;
module.exports = userRouter;
