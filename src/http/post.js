import request from '@/request'

export default {
  /**
   * Create new file
   * @param disk
   * @param path
   * @param name
   * @returns {AxiosPromise<any>}
   */
  createFile(disk, path, name) {
    return request().post('create-file', { disk, path, name })
  },

  /**
   * Update file
   * @param formData
   * @returns {*}
   */
  updateFile(formData) {
    return request().post('update-file', formData)
  },

  /**
   * Create new directory
   * @param data
   * @returns {*}
   */
  createDirectory(data) {
    return request().post('create-directory', data)
  },

  /**
   * Upload file
   * @param data
   * @param config
   * @returns {AxiosPromise<any>}
   */
  upload(data, config) {
    return request().post('upload', data, config)
  },

  /**
   * Delete selected items
   * @param data
   * @returns {*}
   */
  delete(data) {
    return request().post('delete', data)
  },

  /**
   * Rename file or folder
   * @param data
   * @returns {*}
   */
  rename(data) {
    return request().post('rename', data)
  },

  /**
   * Copy / Cut files and folders
   * @param data
   * @returns {*}
   */
  paste(data) {
    return request().post('paste', data)
  },

  /**
   * Zip
   * @param data
   * @returns {*}
   */
  zip(data) {
    return request().post('zip', data)
  },

  /**
   * Unzip
   * @returns {*}
   * @param data
   */
  unzip(data) {
    return request().post('unzip', data)
  },
}
