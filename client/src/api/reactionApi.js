import axiosInstance from './axios.js';

const getPostReactions = (postId) => {
  return axiosInstance.get(`/reactions/post/${postId}`);
};

const getReelReactions = (reelId) => {
  return axiosInstance.get(`/reactions/reel/${reelId}`);
};

const getCommentReactions = (commentId) => {
  return axiosInstance.get(`/reactions/comment/${commentId}`);
};

export default {
  getPostReactions,
  getReelReactions,
  getCommentReactions,
};