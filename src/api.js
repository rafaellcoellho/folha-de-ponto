import axios from "axios";

export const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    baseURL: "https://s3-sa-east-1.amazonaws.com/lar21css/"
  },
  staging: {
    baseURL: ""
  },
  production: {
    baseURL: ""
  }
};

const api = axios.create({
  baseURL: config[env].baseURL,
});

export const folha_de_ponto = {
  list: _ => api.get('/desafio_frontend.json'),
};