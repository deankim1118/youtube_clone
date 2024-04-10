import User from '../models/User';
import Video from '../models/Video';
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
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // Create & save an account into MongoDB if email data is not available
      user = await User.create({
        name: userData.name,
        avatar_url: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        socialOnly: true,
        password: '',
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
};

export const getEdit = (req, res) => {
  return res.render('edit-profile', { pageTitle: 'Edit Profile' });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatar_url },
    },
    body: { inputName, inputEmail, inputUsername, inputLocation },
    file,
  } = req;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatar_url: file ? file.path : avatar_url,
      name: inputName,
      email: inputEmail,
      username: inputUsername,
      location: inputLocation,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect('/users/edit');
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

export const getChangePassword = (req, res) => {
  return res.render('users/change-password', {
    pageTitle: 'Change Password',
  });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'Current password is not correct',
    });
  }

  if (newPassword !== newPassword2) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The password does not match with the confirmation',
    });
  }

  user.password = newPassword;
  user.save();

  return res.redirect('/users/logout');
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate('videos');
  console.log(user);
  if (!user) {
    return res.status(404).render('404', { pageTitle: 'User not found' });
  }
  return res.render('users/profile', {
    pageTitle: `${user.name}'s Profile`,
    user,
  });
};
