import config from "../config";
import {decodeToken} from "react-jwt";
import swal from "sweetalert";
import { constructAuthorizationHeader } from "./utils";

export async function authorize(username: string, password: string) {
  let res = await fetch(
    `${config.rootPath}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": constructAuthorizationHeader(username, password)
      },
      body: '{}',
      credentials: "include"
    }
  ).then(response => {
    return response.json()
  })

  window.sessionStorage.clear();


  if (res["message"] !== undefined && res["message"].includes("Too many failed attempts")){
    swal("Too many failed login attempts", "Please try again later.");
    return res["message"];
  }

  if (res["message"] !== undefined && res["message"].includes("attempts left")){
    swal("Too many failed login attempts", "Please try again later.");
    return res["message"];
  }

  let decodedToken: any | null = decodeToken(res["token"]);
  if (!decodedToken) {
    return false;
  }

  window.sessionStorage.setItem("user", decodedToken["user"])
  window.sessionStorage.setItem("alive", "true");

  return decodedToken;
}

export async function authorizeGithub(password: string) {

  let res = await fetch(
    `${config.rootPath}/api/auth/confirmLoginWithGithub`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password
      }),
      credentials: "include"
    }
  ).then(response => {
    return response.json()
  })

  let decodedToken: any | null = decodeToken(res["token"]);
  if (!decodedToken) {
    return false;
  }

  window.sessionStorage.setItem("user", decodedToken["user"])
  window.sessionStorage.setItem("alive", "true");

  return decodedToken;
}

export async function authorizeGoogle(externalToken: string, password: string) {
  let res = await fetch(
    `${config.rootPath}/api/auth/loginWithGoogle`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_auth: externalToken,
        password: password
      }),
      credentials: "include"
    }
  ).then(response => {
    return response.json()
  })

  if (res["message"] === 'User not found') {
    return "User not found";
  }

  let decodedToken: any | null = decodeToken(res["token"]);
  if (!decodedToken) {
    return false;
  }

  window.sessionStorage.setItem("user", decodedToken["user"])
  window.sessionStorage.setItem("alive", "true");

  return decodedToken;
}

export async function validate2FA(code: string) {
  if (code.length !== 6 || !/^\d+$/.test(code)) {
    if (sessionStorage.getItem("alive") === "true")
      swal("Invalid 2FA Code", "Please enter a valid 2FA code.");
  }

  let res = await fetch(
    `${config.rootPath}/api/otp/validate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp_code: code
      }),
      credentials: "include"
    },
  ).then(response => {
    return response.json()
  })

  let decodedToken: any | null = decodeToken(res["token"]);
  if (!decodedToken) {
    return false;
  }

  window.sessionStorage.setItem("user", decodedToken["user"]);
  window.sessionStorage.setItem("ip", decodedToken["ip"]);
  window.sessionStorage.setItem("expires", decodedToken["exp"]);
  window.sessionStorage.setItem("init_temp", decodedToken["init_temp"]);
  window.sessionStorage.setItem("alive", "true");

  return {
    auth: !(res === undefined || res["auth"] !== true),
    initTemp: false,
    otp: true
  };
}

export async function logout() {
  await fetch(`${config.rootPath}/api/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
  window.sessionStorage.clear();
}
