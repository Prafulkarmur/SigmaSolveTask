// axiosPrivate.ts

import axios, { AxiosInstance } from "axios";
import { getSession, signOut } from "next-auth/react";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const privateInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // Add any other headers you need
  },
});

// Add authentication token to headers (example: using a token from sessionStorage)
privateInstance.interceptors.request.use(async (request) => {
  const session: any = await getSession();
  if (session) {
    request.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return request;
});
privateInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      // Token expired or invalid, log out the user
      await signOut({ redirect: true, callbackUrl: "/" });
    }
    return Promise.reject(error);
  },
);

export default privateInstance;
