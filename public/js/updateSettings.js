import axios from 'axios';
import { notify, displayNotify } from './alerts';

export const handleUpdateAccount = async function (name, email) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update-me-info',
      data: {
        name: name,
        email: email
      }
    });

    if (res.data.status === 'success') {
      displayNotify(res.data.status, res.data.message);
      location.reload(true);
    }
  } catch (err) {
    notify.error(err.response.data.message || 'Update failed. Please try again!');
  }
}
