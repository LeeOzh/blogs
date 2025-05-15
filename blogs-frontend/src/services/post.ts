import request from '../utils/request'

export const getPostList = () => request.get(`/api/post`)

export const getPostById = (id: number) => request.get(`/api/post/${id}`)

export const createPost = (data: {
  title: string
  content: string
  imgUrl: string
}) => request.post(`/api/post/create`, data)

export const updatePostLike = (data: { id: number; like: boolean }) => request.post(`/api/post/updateLike`, data)