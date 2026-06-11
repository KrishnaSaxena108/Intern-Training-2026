import axios from "axios";

const BASE_URL = "https://fakestoreapi.com/products";

export const getProductsAPI = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getProductByIdAPI = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const addProductAPI = async (product) => {
  const response = await axios.post(BASE_URL, product);
  return response.data;
};

export const updateProductAPI = async ({ id, product }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, product);
  return response.data;
};

export const deleteProductAPI = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};