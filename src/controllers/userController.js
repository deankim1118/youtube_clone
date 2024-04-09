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
  } else if (user.socialOnly === true) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'Use Social Login',
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SCRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  if ('access_token' in tokenRequest) {
    // access API
    const { access_token } = tokenRequest;
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect('/login');
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect('/');
    } else {
      // Create & save an account into MongoDB if email data is not available
      const user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        socialOnly: true,
        password: '',
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
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
