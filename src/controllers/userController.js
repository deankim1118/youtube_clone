import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Create Account' });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = 'Join';
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.render('join', {
      pageTitle,
      errorMessage: 'Password is not match',
    });
  }
  if (exists) {
    return res.render('join', {
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
    return console.log('errors : ', err);
  }
};
export const edit = (req, res) => {
  res.send('User Edit');
};
export const remove = (req, res) => {
  res.send('Remove User');
};
export const login = (req, res) => {
  res.send('Login');
};
export const logout = (req, res) => {
  res.send('Logout');
};
export const see = (req, res) => {
  res.send(`User Id is #${req.params.id}`);
};
