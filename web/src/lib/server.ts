import axios from "axios";

const SERVER_URL = "http://localhost:8090";

export type FieldErrors = {
  email?: string;
  password?: string;
};

export async function new_recipe(data: {
  name: string;
  description: string;
  image: Blob;
}) {
  const req = new FormData();
  req.append("name", data.name);
  req.append("description", data.description);
  req.append("image", data.image);

  const resp = await axios.post(`${SERVER_URL}/new-recipe`, req, {
    withCredentials: true,
  });
  return resp.status == 200;
}

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
      email: string;
      phone: string;
    };

export async function get_user() {
  return (
    await axios.get(`${SERVER_URL}/user`, {
      withCredentials: true,
    })
  ).data as User;
}

export async function logout() {
  await axios.post(
    `${SERVER_URL}/logout`,
    {},
    {
      withCredentials: true,
    },
  );
}
