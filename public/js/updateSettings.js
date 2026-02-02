import axios from 'axios';
import { notify, displayNotify } from './alerts';

export const handleUpdateAccount = async function (data, type) {
  try {
    const URL = type === 'password' 
      ? '/api/v1/users/update-password' 
      : '/api/v1/users/update-me-info'; 
    
    const res = await axios({
      method: 'PATCH',
      url: URL,
      data: data,
    });

    if (res.data.status === 'success') {
      displayNotify(res.data.status, `${type.toUpperCase()} updated successfully!`);
      location.reload(true);
    }
  } catch (err) {
    notify.error(err.response.data.message || 'Update failed. Please try again!');
  }
}
