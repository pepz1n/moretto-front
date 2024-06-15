import axios from "axios";

export default defineNuxtPlugin(() => {
  const domain = 'http://localhost:3232/'

  let api = axios.create({
    baseURL: domain,
    headers: {
      common: {
        Authorization: `Bearer`
      }
    }
  });

  api.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    return Promise.reject(error);
  });

  api.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (process.client) {

    }
  })

  return {
    provide: {
      api: api
    }
  }
})
