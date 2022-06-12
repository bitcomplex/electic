import axios from "axios";
import oauth from "axios-oauth-client";
import tokenProvider from "axios-token-interceptor";

// NB: Only for local use, since env-variables will be included in final build
const netatmoClientCredentials = oauth.client(axios.create(), {
  url: "https://api.netatmo.com/oauth2/token",
  grant_type: "password",
  client_id: process.env.REACT_APP_NETATMO_CLIENT,
  client_secret: process.env.REACT_APP_NETATMO_SECRET,
  username: process.env.REACT_APP_NETATMO_USER,
  password: process.env.REACT_APP_NETATMO_PASS,
  scope: "read_station",
});

export const netatmoClient = axios.create();

// Handle oauth refresh
netatmoClient.interceptors.request.use(
  oauth.interceptor(tokenProvider, netatmoClientCredentials)
);
