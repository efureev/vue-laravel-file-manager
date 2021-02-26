import request from '@/request'

export default {
  /**
   * Get configuration data from server
   * @returns {*}
   */
  initialize() {
    return request().get('initialize')
  },

  /**
   * Get directories for the tree (upper level)
   * @param disk
   * @param path
   * @returns {*}
   */
  tree(disk, path = null) {
    return request().get('tree', { params: { disk, path } })
  },

  /**
   * Select disk
   * @param disk
   * @returns {*}
   */
  selectDisk(disk) {
    return request().get('select-disk', { params: { disk } })
  },

  /**
   * Get content (files and folders)
   * @param disk
   * @param path
   * @returns {*}
   */
  content(disk, path) {
    return request().get('content', { params: { disk, path } })
  },

  /**
   * Item properties
   */
  /* properties(disk, path) {
   return HTTP.get('properties', { params: { disk, path } });
   }, */

  /**
   * URL
   * @param disk
   * @param path
   * @returns {*}
   */
  url(disk, path) {
    return request().get('url', { params: { disk, path } })
  },

  /**
   * Get file to editing or showing
   * @param disk
   * @param path
   * @returns {*}
   */
  getFile(disk, path) {
    // return request({ responseWrapper: { dataKey: null } }).get('download', { params: { disk, path } })
    return request({ responseWrapper: { dataKey: null } }).get('download', { params: { disk, path } })
  },

  /**
   * Get file - ArrayBuffer
   * @param disk
   * @param path
   * @returns {*}
   */
  getFileArrayBuffer(disk, path) {
    return request().get('download', {
      responseType: 'arraybuffer',
      params: { disk, path },
    })
  },

  /**
   * Image thumbnail
   * @param disk
   * @param path
   * @returns {*}
   */
  thumbnail(disk, path) {
    return request().get('thumbnails', {
      responseType: 'arraybuffer',
      params: { disk, path },
    })
  },

  /**
   * Image preview
   * @param disk
   * @param path
   * @return {*}
   */
  preview(disk, path) {
    return request().get('preview', {
      responseType: 'arraybuffer',
      params: { disk, path },
    })
  },

  /**
   * Download file
   * @param disk
   * @param path
   * @return {*}
   */
  download(disk, path) {
    return request().get('download', {
      responseType: 'arraybuffer',
      params: { disk, path },
    })
  },

  baseURL() {
    return request().wrapper.config.baseURL
  },

  makeURL(url) {
    return this.baseURL() + url
  },
}
