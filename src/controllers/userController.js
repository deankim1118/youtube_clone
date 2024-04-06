import User from '../models/User';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Create Account' });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = 'Join';
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.status(400).render('join', {
      pageTitle,
      errorMessage: 'Password is not match',
    });
  }
  if (exists) {
    return res.status(400).render('join', {
      pageTitle,
      errorMessage: 'This Email/Username is already taken',
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect('/login');
  } catch (err) {
    return res
      .status(404)
      .render('join', { pageTitle: 'Join', errorMessage: err._message });
  }
};
export const getLogin = (req, res) => {
  res.status(200).render('login', { pageTitle: 'Login' });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = 'Login';
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: "username doesn't exist",
    });
  }
  // check if password exists
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'Wrong password',
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};
export const edit = (req, res) => {
  res.send('User Edit');
};
export const remove = (req, res) => {
  res.send('Remove User');
};
export const logout = (req, res) => {
  res.send('Logout');
};
export const see = (req, res) => {
  res.send(`User Id is #${req.params.id}`);
};
