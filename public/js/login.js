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
    
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
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
