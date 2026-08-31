import axiosInstance from './axios.js';

const createListing = (data) => {
  return axiosInstance.post('/marketplace', data);
};

const getAllListings = (page = 1, limit = 20, campusId = null, category = null, search = null) => {
  return axiosInstance.get('/marketplace', {
    params: { page, limit, campusId, category, search },
  });
};

const getListingById = (id) => {
  return axiosInstance.get(`/marketplace/${id}`);
};

const updateListing = (id, data) => {
  return axiosInstance.put(`/marketplace/${id}`, data);
};

const deleteListing = (id) => {
  return axiosInstance.delete(`/marketplace/${id}`);
};

const markAsSold = (id) => {
  return axiosInstance.put(`/marketplace/${id}/sold`);
};

const getMyListings = (page = 1, limit = 20) => {
  return axiosInstance.get('/marketplace/my-listings', {
    params: { page, limit },
  });
};

const getCategories = () => {
  return axiosInstance.get('/marketplace/categories');
};

export default {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  markAsSold,
  getMyListings,
  getCategories,
};