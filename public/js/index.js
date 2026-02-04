/* eslint-disable */
import './alerts';
import { displayMap } from './mapbox';
import { handleLogin, handleSignUp, handleLogout } from './login';
import { handleUpdateAccount } from './updateSettings';
import { bookTour } from './stripe';

const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const logOutBtn = document.querySelector('.nav__el--logout');
const mapContainer = document.getElementById('map');
const photoInput = document.querySelector('#photo');
const photoPreview = document.querySelector('.form__user-photo');
const bookBtn = document.querySelector('#book-tour');

// Preview photo 
if (photoInput && photoPreview) {
  photoInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        photoPreview.src = event.target.result;
      }
      reader.readAsDataURL(file);
    }
  }); 
}
// End preview photo

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

// Sign up 
if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    handleSignUp(name, email, password, passwordConfirm);
  });
}

// End sign up 

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
    const photo = e.target.photo.files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('photo', photo);

    handleUpdateAccount(formData, 'account');
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

// Book tour 
if (bookBtn) {
  bookBtn.addEventListener('click', async e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
// End book tour
