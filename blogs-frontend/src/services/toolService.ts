import request from '../utils/request'

export interface ToolCategory {
  id: number;
  name: string;
  icon?: string;
  sortOrder: number;
  tools: Tool[];
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  icon?: string;
  categoryId: number;
  color?: string;
  componentName?: string;
  url?: string;
  type: 'INTERNAL' | 'EXTERNAL';
  status: 'ACTIVE' | 'DEVELOPING' | 'DISABLED';
  clickCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteCategory {
  id: number;
  name: string;
  icon?: string;
  sortOrder: number;
  websites: Website[];
}

export interface Website {
  id: number;
  name: string;
  description: string;
  icon?: string;
  categoryId: number;
  color?: string;
  url: string;
  clickCount: number;
  sortOrder: number;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

// 获取工具列表
export const getTools = () => request.get('/api/tools')

// 获取网站列表
export const getWebsites = () => request.get('/api/websites')

// 记录工具点击
export const recordToolClick = (toolId: number) => request.post(`/api/tools/${toolId}/click`)

// 记录网站点击
export const recordWebsiteClick = (websiteId: number) => request.post(`/api/websites/${websiteId}/click`)

// 获取热门工具
export const getPopularTools = (limit: number = 10) => request.get(`/api/tools/popular/list?limit=${limit}`)

// 获取热门网站
export const getPopularWebsites = (limit: number = 10) => request.get(`/api/websites/popular/list?limit=${limit}`)

// 搜索工具
export const searchTools = (query: string) => request.get(`/api/tools/search/query?q=${encodeURIComponent(query)}`)

// 搜索网站
export const searchWebsites = (query: string) => request.get(`/api/websites/search/query?q=${encodeURIComponent(query)}`)

// 获取工具详情
export const getToolById = (id: number) => request.get(`/api/tools/${id}`)

// 获取网站详情
export const getWebsiteById = (id: number) => request.get(`/api/websites/${id}`)

// 管理员接口：创建工具分类
export const createToolCategory = (data: {
  name: string;
  icon?: string;
  sortOrder?: number;
}) => request.post('/api/tools/categories', data)

// 管理员接口：创建工具
export const createTool = (data: {
  name: string;
  description: string;
  icon?: string;
  categoryId: number;
  color?: string;
  componentName?: string;
  url?: string;
  type?: 'INTERNAL' | 'EXTERNAL';
  status?: 'ACTIVE' | 'DEVELOPING' | 'DISABLED';
  sortOrder?: number;
}) => request.post('/api/tools/create', data)

// 管理员接口：更新工具
export const updateTool = (id: number, data: Partial<{
  name: string;
  description: string;
  icon: string;
  categoryId: number;
  color: string;
  componentName: string;
  url: string;
  type: 'INTERNAL' | 'EXTERNAL';
  status: 'ACTIVE' | 'DEVELOPING' | 'DISABLED';
  sortOrder: number;
}>) => request.put(`/api/tools/${id}`, data)

// 管理员接口：删除工具
export const deleteTool = (id: number) => request.delete(`/api/tools/${id}`)

// 管理员接口：创建网站分类
export const createWebsiteCategory = (data: {
  name: string;
  icon?: string;
  sortOrder?: number;
}) => request.post('/api/websites/categories', data)

// 管理员接口：创建网站
export const createWebsite = (data: {
  name: string;
  description: string;
  icon?: string;
  categoryId: number;
  color?: string;
  url: string;
  sortOrder?: number;
  status?: 'ACTIVE' | 'DISABLED';
}) => request.post('/api/websites/create', data)

// 管理员接口：更新网站
export const updateWebsite = (id: number, data: Partial<{
  name: string;
  description: string;
  icon: string;
  categoryId: number;
  color: string;
  url: string;
  sortOrder: number;
  status: 'ACTIVE' | 'DISABLED';
}>) => request.put(`/api/websites/${id}`, data)

// 管理员接口：删除网站
export const deleteWebsite = (id: number) => request.delete(`/api/websites/${id}`)