import Cookies from 'universal-cookie';

export function setLocalData(name, value) {
  const cookie = new Cookies();
  cookie.set(name, value, { path: '/', domain: '.kfcoding.com' });
}

export function getLocalData(name) {
  const cookie = new Cookies();
  return cookie.get(name, { path: '/', domain: '.kfcoding.com' });
}

export function removeLocalData(name) {
  const cookie = new Cookies();
  cookie.remove(name, { path: '/', domain: '.kfcoding.com' });
}
