const formLogin = document.querySelector('.form');

const handleLogin = async function (email, password) {
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
      alert('Logged successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
}

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
