import axiosInstance from './axios.js';

const createStory = (data) => {
  return axiosInstance.post('/stories', data);
};

const getActiveStories = (campusId = null) => {
  return axiosInstance.get('/stories', {
    params: { campusId },
  });
};

const getMyStories = () => {
  return axiosInstance.get('/stories/my-stories');
};

const getStoryById = (id) => {
  return axiosInstance.get(`/stories/${id}`);
};

const deleteStory = (id) => {
  return axiosInstance.delete(`/stories/${id}`);
};

export default {
  createStory,
  getActiveStories,
  getMyStories,
  getStoryById,
  deleteStory,
};