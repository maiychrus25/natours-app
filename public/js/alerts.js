import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export const notify = new Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top'
  },
  dismissible: true
});

let existNotify = JSON.parse(sessionStorage.getItem("notify"));
if (existNotify) {
  if (existNotify.status === 'success') {
    notify.success(existNotify.message);
  }

  if (existNotify.status === 'error' || existNotify.status === 'fail') {
    notify.error(existNotify.message);
  }

  sessionStorage.removeItem("notify");
}

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? JSON.parse(decodeURIComponent(match[2])) : null;
}

const notifyData = getCookie("notify");
if (notifyData) {
  if (notifyData.status === 'success') {
    notify.success(notifyData.message);
  } else {
    notify.error(notifyData.message);
  }

  document.cookie = 'notify=; Max-Age=0; path=/';
}

export const displayNotify = function (status, message) {
  sessionStorage.setItem("notify", JSON.stringify({status, message}));
}
