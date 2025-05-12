import request from '../utils/request'

export const getPostList = () => request.get(`/api/post`)

export const getPostById = (id: number) => request.get(`/api/post/${id}`)

export const createPost = (data: {
  title: string
  content: string
}) => request.post(`/api/post/create`, data)