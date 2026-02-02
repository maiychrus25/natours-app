/* eslint-disable */
import './alerts';
import { displayMap } from './mapbox';
import { handleLogin, handleLogout } from './login';
import { handleUpdateAccount } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
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

    handleUpdateAccount(name, email);
  });
}

// End update user data

// Mapbox 
if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  displayMap(locations);
}

// End Mapbox
