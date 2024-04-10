import express from 'express';
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  checkUserMiddleware,
  avatarUpload,
} from '../middlewares';
import {
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);

userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single('avatar'), checkUserMiddleware, postEdit);

userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);

userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

// Add Regular Expression (\\d+) to get only NUMBER Id
userRouter.get('/:id(\\d+)', see);

// export default userRouter;
module.exports = userRouter;
