/* eslint-disable */
import axios from 'axios';
import { notify, displayNotify } from './alerts';

export const handleLogin = async function (email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signin',
      data: {
        email: email,
        password: password
      }
    });
    
    if (res.data.status === 'success') {
      const username = res.data.data.user.name.split(' ')[0];
      displayNotify(res.data.status, `Welcome back, ${username}!`);
      location.assign('/');
    } 
  } catch (err) {
    notify.error(err.response.data.message || 'Login failed. Please try again!');
  }
}

export const handleLogout = async function () {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status == 'success') {
      displayNotify(res.data.status, res.data.message);
      location.reload(true);
    }
  } catch (err) {
    notify.error(err.response.data.message || 'Logout failed. Please try again!');
  }
}
