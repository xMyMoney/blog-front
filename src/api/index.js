import axios from 'axios'
import Qs from 'qs'
import store from 'STORE/index'
import router from '../router'

import {
  getAccessToken,
  removeAccessToken,
  cachedAdminInfo
} from 'API/cacheService'

import {
  IS_LOGIN,
  SHOW_TOKEN_ERROR
} from 'STORE/mutation-types'

/* eslint-disable */
const API_ROOT = 'http://localhost:8080/'
const API_ROOT_DEV = 'http://localhost:8080/'
// const API_ROOT = 'http://112.74.93.209:8080/'
// const API_ROOT_DEV = 'http://112.74.93.209:8080/'

/* eslint-enable */
axios.defaults.baseURL = (process.env.NODE_ENV === 'production' ? API_ROOT : API_ROOT_DEV)

axios.defaults.headers.Accept = 'application/json'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  if (config.url.indexOf('admin/') === 0) {
    if (getAccessToken()) {
      config.headers['token'] = getAccessToken()
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // if (response.data.code === 200) {
  //   if (response.data.code === -4001) {
  //     // 清空登录信息
  //     removeAccessToken()
  //     cachedAdminInfo.delete()
  //     // // 弹出提示信息
  //     store.commit(SHOW_TOKEN_ERROR, true)
  //     // // 弹出登录窗口
  //     store.commit(IS_LOGIN, false)
  //   }
  //   let error = {
  //     msg: response.data.msg
  //   }
  //   return Promise.reject(error)
  // }
  if (response.data.code === 200) {
    return response
  } else if (response.data.code === 201) {
    // 清空登录信息
    removeAccessToken()
    cachedAdminInfo.delete()
    // // 弹出提示信息
    store.commit(SHOW_TOKEN_ERROR, true)
    // // 弹出登录窗口
    // store.commit(IS_LOGIN, false)
    router.push('/login')
    let error = {
      msg: response.data.msg
    }
    return Promise.reject(error)
  } else {
    let error = {
      msg: response.data.msg
    }
    return Promise.reject(error)
  }
}, function (error) {
  error = {
    msg: '请求出错'
  }
  return Promise.reject(error)
})

export default {
  /**
   * 管理员登录
   */
  adminLogin (params) {
    return axios.post('admin/login', Qs.stringify(params))
  },
  /**
   * 获取七牛token
   */
  getQiniuToken (withWater) {
    return axios.get('a/qiniu/token', {
      params: {
        bucket: 'blogimg',
        withWater: withWater
      }
    })
  },
  getAliCloudToken () {
    return axios.get('token')
  },
  /**
   * 上传图片到七牛
   */
  /**
   * uploadToQiniu (params) {
    return axios.post('http://up-z2.qiniu.com', params, {
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: false
    })
  }, */
  uploadToQiniu (params) {
    return axios.post('http://up-z2.qiniu.com', params, {
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: false
    })
  },
  uploadToAliCloud (params) {
    console.log(params)
    return axios.put('https://pig-blog.oss-cn-guangzhou.aliyuncs.com/', params, {
      headers: {
        'content-type': 'multipart/form-data'
        // 'content-type': 'application/x-www-form-urlencoded'
      },
      withCredentials: false
    })
  },
  /**
   * 获取博客配置
   */
  getBlogConfig () {
    return axios.get('admin/webConfig')
  },
  /**
   * 修改博客配置
   */
  modifyBlogConfig (params) {
    return axios.put('admin/webConfig/me', Qs.stringify(params))
  },
  /**
   * 获取 关于我 页面
   */
  getAboutMe () {
    return axios.get('admin/webConfig/me')
  },
  /**
   * 修改 关于我 页面
   */
  modifyAboutMe (params) {
    return axios.put('admin/webConfig/about', Qs.stringify(params))
  },
  /**
   * 获取首页面板显示的统计信息
   */
  getHomeStatistics () {
    return axios.get('admin/statistics/home')
  },
  /**
   * 获取系统日志
   */
  getSysLog (params) {
    return axios.get('a/sys/log', {params: params})
  },
  /**
   * 添加分类
   */
  addCategory (categoryName) {
    return axios.post('admin/category', Qs.stringify({categoryName: categoryName}))
  },
  /**
   * 添加标签
   */
  addTag (tagName) {
    return axios.post('admin/tag', Qs.stringify({tagName: tagName}))
  },
  /**
   * 修改分类
   */
  modifyCategory (params) {
    return axios.put('admin/category', Qs.stringify(params))
  },
  /**
   * 修改标签
   */
  modifyTag (params) {
    return axios.put('admin/tag', Qs.stringify(params))
  },
  /**
   * 删除分类
   */
  deleteCategory (categoryId) {
    return axios.delete('admin/category', {params: {categoryId: categoryId}})
  },
  /**
   * 删除标签
   */
  deleteTag (tagId) {
    return axios.delete('admin/tag', {params: {tagId: tagId}})
  },
  /**
   * 获取分类列表
   */
  getCategoryList (params) {
    return axios.get('admin/category/list', {
      params: params
    })
  },
  /**
   * 获取标签列表
   */
  getTagList (params) {
    return axios.get('admin/tag/list', {
      params: params
    })
  },
  /**
   * 获取分类
   */
  getCategory (categoryId) {
    return axios.get('admin/category', {
      params: {
        categoryId: categoryId
      }
    })
  },
  /**
   * 获取标签
   */
  getTag (tagId) {
    return axios.get('admin/tag', {
      params: {
        tagId: tagId
      }
    })
  },
  /**
   * 保存文章
   */
  saveArticle (params) {
    return axios.post('admin/article/save', params)
  },
  /**
   * 发布文章
   */
  publishArticle (article) {
    return axios.post('admin/article', article)
  },
  /**
   * 编辑文章
   */
  modifyArticle (params) {
    return axios.post('a/article/modify', Qs.stringify(params))
  },
  /**
   * 删除文章
   */
  deleteArticle (articleId) {
    return axios.delete('admin/article', {params: {articleId: articleId}})
  },
  /**
   * 获取文章信息
   */
  getArticle (articleId) {
    return axios.get('admin/article', {
      params: {
        id: articleId
      }
    })
  },
  /**
   * 获取文章列表
   */
  getArticleList (params) {
    return axios.get('article/list', {
      params: params
    })
  },
  /**
   * 后台获取文章列表
   */
  getArticleListToAdmin (params) {
    return axios.get('admin/article/list', {
      params: params
    })
  },
  /**
   * 获取友链列表
   */
  getFriendsList (params) {
    return axios.get('a/friends/list', {
      params: params
    })
  },
  /**
   * 添加友链
   */
  addFriend (params) {
    return axios.post('a/friends/add', Qs.stringify(params))
  },
  /**
   * 编辑友链
   */
  modifyFriend (params) {
    return axios.post('a/friends/modify', Qs.stringify(params))
  },
  /**
   * 删除友链
   */
  deleteFriend (friendId) {
    return axios.post('a/friends/delete', Qs.stringify({friendId: friendId}))
  },
  /**
   * 获取友链类型列表
   */
  getFriendTypeList () {
    return axios.get('a/friends/typeList')
  },
  /**
   * 获取所有评论列表
   */
  getAllCommentsList (params) {
    return axios.get('admin/comments/list', {
      params: params
    })
  },
  /**
   * 获取文章评论列表
   */
  getComments (articleId) {
    return axios.get('a/comments/list', {
      params: {
        articleId: articleId
      }
    })
  },
  /**
   * 添加评论
   */
  adminReplyComments (params) {
    return axios.post('a/comments/add', Qs.stringify(params))
  },
  /**
   * 删除评论
   */
  deleteComments (id) {
    return axios.post('a/comments/delete', Qs.stringify({commentsId: id}))
  },
  /**
   * 获取 我的简历 页面
   */
  getResume () {
    return axios.get('a/webConfig/getResume')
  },
  /**
   * 修改 我的简历 页面
   */
  modifyResume (params) {
    return axios.post('a/webConfig/modifyResume', Qs.stringify(params))
  },
  // ---------------------------------------------以下是博客页面使用的接口---------------------------------------------,
  /**
   * 获取 关于我 页面
   */
  getBlogAboutMe () {
    return axios.get('me/about')
  },
  /**
   * 获取博客信息
   */
  getBlogInfo () {
    return axios.get('me/blogInfo')
  },
  testSecret (params) {
    return axios.post('me/testSecret', params)
  },
  /**
   * 获取文章列表
   */
  getBlogArticleList (params) {
    return axios.get('article/list', {
      params: params
    })
  },
  /**
   * 获取文章归档列表
   */
  getBlogArticleArchives (params) {
    return axios.get('article/archives', {
      params: params
    })
  },
  /**
   * 获取文章信息
   */
  getBlogArticle (articleId) {
    return axios.get('article', {
      params: {
        id: articleId
      }
    })
  },
  /**
   * 获取分类列表
   */
  getBlogCategoryList () {
    return axios.get('category/list')
  },
  /**
   * 获取标签列表
   */
  getBlogTagList () {
    return axios.get('tag/list')
  },
  /**
   * 获取友链列表
   */
  getBlogFriendsList () {
    return axios.get('w/friends/list')
  },
  /**
   * 获取文章评论列表
   */
  getBlogComments (articleId) {
    return axios.get('comments', {
      params: {
        articleId: articleId
      }
    })
  },
  /**
   * 添加评论
   */
  replyComments (params) {
    return axios.post('comments', Qs.stringify(params))
  },
  /**
   * 获取 我的简历 页面
   */
  getBlogResume () {
    return axios.get('w/getResume')
  },
  /**
   * 按文章标题和简介搜索
   */
  searchArticle (params) {
    return axios.get('article/search', {
      params: params
    })
  }
}
