import axios from "axios";
import { ContactFormData } from "../pages/Homepage";

const SERVER_URL = "http://localhost:8090";

export type FieldErrors = {
  email?: string;
  password?: string;
};

export type RecipeResponse = {
  name: string;
  description: string;
  id: string;
  author: string;
  num_ratings: number;
  ratings_sum: number;
};

export type Recipe = RecipeResponse & {
  image_url: string;
  avg_rating: number;
};

export async function rate_recipe(data: { rating: number; recipe_id: string }) {
  (
    await axios.post(`${SERVER_URL}/rate-recipe`, data, {
      withCredentials: true,
    })
  ).status == 200;
}

export async function get_user_rating(post_id: string) {
  return (
    await axios.get(`${SERVER_URL}/get-rating/${post_id}`, {
      withCredentials: true,
    })
  ).data as string;
}

export async function get_recipes(): Promise<Recipe[]> {
  const resp = await axios.get(`${SERVER_URL}/recipes`);
  const data = resp.data as RecipeResponse[];
  return data.map((r) => {
    return {
      image_url: `${SERVER_URL}/recipe-img/${r.id}`,
      avg_rating: r.num_ratings !== 0 ? r.ratings_sum / r.num_ratings : 0,
      ...r,
    };
  });
}

export async function get_top_recipes(count: number): Promise<Recipe[]> {
  const resp = await axios.get(`${SERVER_URL}/top-rated/${count}`);
  const data = resp.data as RecipeResponse[];
  return data.map((r) => {
    return {
      image_url: `${SERVER_URL}/recipe-img/${r.id}`,
      avg_rating: r.num_ratings !== 0 ? r.ratings_sum / r.num_ratings : 0,
      ...r,
    };
  });
}

export async function new_contact_form(data: ContactFormData) {
  (await axios.post(`${SERVER_URL}/contact`, data)).status == 200;
}

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
