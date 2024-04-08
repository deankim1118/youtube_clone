import express from 'express';
import {
  edit,
  remove,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get('/edit', edit);
userRouter.get('/remove', remove);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);
// Add Regular Expression (\\d+) to get only NUMBER Id
userRouter.get('/:id(\\d+)', see);

// export default userRouter;
module.exports = userRouter;
