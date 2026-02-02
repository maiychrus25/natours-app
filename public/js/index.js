/* eslint-disable */
import './alerts';
import { displayMap } from './mapbox';
import { handleLogin, handleLogout } from './login';

const formLogin = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const mapContainer = document.getElementById('map');

// Login 
if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
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

// Mapbox 
if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  displayMap(locations);
}
// End Mapbox
