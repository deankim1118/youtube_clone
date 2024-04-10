import User from './models/User';

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = 'Wetube';
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect('/');
  }
};

export const checkUserMiddleware = (req, res, next) => {
  const { username, email } = req.session.user;
  const { inputUsername, inputEmail } = req.body;

  if (username !== inputUsername) {
    const usernameExists = User.exists({ inputUsername });
    if (usernameExists) {
      return res.status(400).render('edit-profile', {
        errorMessage: 'This Username is already exists',
      });
    }
    return next();
  }
  if (email !== inputEmail) {
    const userEmailExists = User.exists({ inputEmail });
    if (userEmailExists) {
      return res.status(400).render('edit-profile', {
        errorMessage: 'This Email is already exists',
      });
    }
    return next();
  }
};
