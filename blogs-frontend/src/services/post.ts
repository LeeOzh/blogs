import request from '../utils/request'

export const getPostList = () => request.get(`/api/post`)