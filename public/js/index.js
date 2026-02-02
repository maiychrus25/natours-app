/* eslint-disable */
import './alerts';
import { displayMap } from './mapbox';
import { handleLogin, handleLogout } from './login';
import { handleUpdateAccount } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const logOutBtn = document.querySelector('.nav__el--logout');
const mapContainer = document.getElementById('map');

// Login 
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    handleLogin(email, password);
  });
}

// End Login

// Logout
if (logOutBtn) {
  logOutBtn.addEventListener('click', handleLogout);
}

// End logout

// Update user data 
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;

    handleUpdateAccount({ name, email }, 'account');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const savePasswordBtn = document.querySelector('.btn--save-password');

    savePasswordBtn.textContent = 'Updating...';
    const passwordCurrent = e.target.passwordCurrent.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    await handleUpdateAccount({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
    savePasswordBtn.textContent = 'Save password';
  });
}

// End update user data

// Mapbox 
if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  displayMap(locations);
}

// End Mapbox
