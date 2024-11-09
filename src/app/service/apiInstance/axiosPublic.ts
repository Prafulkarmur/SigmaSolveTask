// axiosPublic.ts

import axios, { AxiosInstance } from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const publicInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // Add any other headers you need
  },
});

export default publicInstance;
