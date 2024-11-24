import axios from "axios";

const SERVER_URL = "http://localhost:8090";

export type FieldErrors = {
  email?: string;
  password?: string;
};

export async function register(data: {
  name: string;
  phone: string;
  email: string;
  password: string;
}) {
  const resp = await axios.post(`${SERVER_URL}/register`, data, {
    withCredentials: true,
  });
  if (resp.data) {
    return resp.data as FieldErrors;
  } else {
    return undefined;
  }
}

export async function login(data: { email: string; password: string }) {
  const resp = await axios.post(`${SERVER_URL}/login`, data, {
    withCredentials: true,
  });
  if (resp.data) {
    return resp.data as FieldErrors;
  } else {
    return undefined;
  }
}

export type User =
  | {}
  | {
      name: string;
    };

export async function get_user() {
  return (
    await axios.get(`${SERVER_URL}/user`, {
      withCredentials: true,
    })
  ).data as User;
}
