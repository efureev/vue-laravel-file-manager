/* eslint-disable max-len,prefer-destructuring,object-curly-newline */
import GET from '../http/get'
// import request from '@/request'
import POST from '../http/post'

export default {
  /**
   * Get initiation data from server
   * @param state
   * @param commit
   * @param getters
   * @param dispatch
   * @changed
   */
  initializeApp({ state, commit, getters, dispatch }) {
    GET.initialize().then(response => {
      const configData = response.data()
      // if (response.data.result.status === 'success') {

      commit('settings/initSettings', configData)
      commit('setDisks', configData.disks)

      let leftDisk = configData.leftDisk ? configData.leftDisk : getters.diskList[0]

      let rightDisk = configData.rightDisk ? configData.rightDisk : getters.diskList[0]

      // paths
      let leftPath = configData.leftPath
      let rightPath = configData.rightPath

      // find disk and path settings in the URL
      if (window.location.search) {
        const params = new URLSearchParams(window.location.search)

        if (params.get('leftDisk')) {
          leftDisk = params.get('leftDisk')
        }

        if (params.get('rightDisk')) {
          rightDisk = params.get('rightDisk')
        }

        if (params.get('leftPath')) {
          leftPath = params.get('leftPath')
        }

        if (params.get('rightPath')) {
          rightPath = params.get('rightPath')
        }
      }

      commit('left/setDisk', leftDisk)

      // if leftPath not null
      if (leftPath) {
        commit('left/setSelectedDirectory', leftPath)
        commit('left/addToHistory', leftPath)
      }

      dispatch('getLoadContent', {
        manager: 'left',
        disk: leftDisk,
        path: leftPath,
      })

      // if selected left and right managers
      if (state.settings.windowsConfig === 3) {
        commit('right/setDisk', rightDisk)

        // if rightPath not null
        if (rightPath) {
          commit('right/setSelectedDirectory', rightPath)
          commit('right/addToHistory', rightPath)
        }

        dispatch('getLoadContent', {
          manager: 'right',
          disk: rightDisk,
          path: rightPath,
        })
      } else if (state.settings.windowsConfig === 2) {
        // if selected left manager and directories tree
        // init directories tree
        dispatch('tree/initTree', leftDisk).then(() => {
          if (leftPath) {
            // reopen folders if path not null
            dispatch('tree/reopenPath', leftPath)
          }
        })
        // }
      }
    })
  },

  /**
   * Download files and folders to the selected file manager
   * @param context
   * @param manager
   * @param disk
   * @param path
   * @changed
   */
  getLoadContent({ commit }, { manager, disk, path }) {
    GET.content(disk, path)
      .then(response => {
        commit(`${manager}/setDirectoryContent`, response.data())
      })
      .catch(err => {})
  },

  /**
   * Select disk
   * @param state
   * @param commit
   * @param dispatch
   * @param disk
   * @param manager
   * @changed
   */
  selectDisk({ state, commit, dispatch }, { disk, manager }) {
    GET.selectDisk(disk)
      .then(response => {
        // set disk name
        commit(`${manager}/setDisk`, disk)

        // reset history
        commit(`${manager}/resetHistory`)

        // reinitialize tree if directories tree is shown
        if (state.settings.windowsConfig === 2) {
          dispatch('tree/initTree', disk)
        }

        // download content for root path
        dispatch(`${manager}/selectDirectory`, { path: null, history: false })
      })
      .catch(err => {})
  },

  /**
   * Create new file
   * @param getters
   * @param dispatch
   * @param fileName
   * @returns {Promise}
   * @changed
   */
  createFile({ getters, dispatch }, fileName) {
    // directory for new file
    const selectedDirectory = getters.selectedDirectory

    // create new file, server side
    return POST.createFile(getters.selectedDisk, selectedDirectory, fileName)
      .then(response => {
        // update file list
        dispatch('updateContent', {
          data: response.data(),
          oldDir: selectedDirectory,
          commitName: 'addNewFile',
          type: 'file',
        })

        return response
      })
      .catch(err => {})
  },

  /**
   * Get file content
   * @param context
   * @param disk
   * @param path
   * @returns {*}
   * @changed
   */
  getFile(context, { disk, path }) {
    return GET.getFile(disk, path)
  },

  /**
   * Update file
   * @param getters
   * @param dispatch
   * @param formData
   * @returns {PromiseLike | Promise}
   * @changed
   */
  updateFile({ getters, dispatch }, formData) {
    return POST.updateFile(formData)
      .then(response => {
        // update file list
        dispatch('updateContent', {
          data: response.data(),
          oldDir: getters.selectedDirectory,
          commitName: 'updateFile',
          type: 'file',
        })

        return response
      })
      .catch(err => {})
  },

  /**
   * Create new directory
   * @param getters
   * @param dispatch
   * @param name
   * @returns {*|PromiseLike<T | never>|Promise<T | never>}
   * @changed
   */
  createDirectory({ getters, dispatch }, name) {
    // directory for new folder
    const selectedDirectory = getters.selectedDirectory

    // create new directory, server side
    return POST.createDirectory({
      disk: getters.selectedDisk,
      path: selectedDirectory,
      name,
    })
      .then(response => {
        // update file list
        dispatch('updateContent', {
          data: response.data(),
          oldDir: selectedDirectory,
          commitName: 'addNewDirectory',
          type: 'directory',
        })

        return response
      })
      .catch(err => {})
  },

  /**
   * Upload file or files
   * @param getters
   * @param commit
   * @param dispatch
   * @param files
   * @param overwrite
   * @returns {Promise}
   * @changed
   */
  upload({ getters, commit, dispatch }, { files, overwrite }) {
    // directory where files will be uploaded
    const selectedDirectory = getters.selectedDirectory

    // create new form data
    const data = new FormData()
    data.append('disk', getters.selectedDisk)
    data.append('path', selectedDirectory || '')
    data.append('overwrite', overwrite)
    // add file or files
    for (let i = 0; i < files.length; i += 1) {
      data.append('files[]', files[i])
    }

    // axios config - progress bar
    const config = {
      onUploadProgress(progressEvent) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        commit('messages/setProgress', progress)
      },
    }

    // upload files
    return POST.upload(data, config)
      .then(response => {
        // clear progress
        commit('messages/clearProgress')

        if (selectedDirectory === getters.selectedDirectory) {
          // refresh content
          dispatch('refreshManagers')
        }

        return response
      })
      .catch(() => {
        // clear progress
        commit('messages/clearProgress')
      })
  },

  /**
   * Delete selected files and folders
   * @param state
   * @param getters
   * @param dispatch
   * @param items
   * @returns {*|PromiseLike<T | never>|Promise<T | never>}
   * @changed
   */
  delete({ state, getters, dispatch }, items) {
    return POST.delete({
      disk: getters.selectedDisk,
      items,
    })
      .then(response => {
        // refresh content
        dispatch('refreshManagers')

        // delete directories from tree
        if (state.settings.windowsConfig === 2) {
          const onlyDir = items.filter(item => item.type === 'dir')
          dispatch('tree/deleteFromTree', onlyDir)
        }

        return response
      })
      .catch(err => {})
  },

  /**
   * Paste files and folders
   * @param state
   * @param commit
   * @param getters
   * @param dispatch
   * @changed
   */
  paste({ state, commit, getters, dispatch }) {
    POST.paste({
      disk: getters.selectedDisk,
      path: getters.selectedDirectory,
      clipboard: state.clipboard,
    })
      .then(response => {
        // refresh content
        dispatch('refreshAll')

        // if action - cut - clear clipboard
        if (state.clipboard.type === 'cut') {
          commit('resetClipboard')
        }
      })
      .catch(err => {})
  },

  /**
   * Rename file or folder
   * @param getters
   * @param dispatch
   * @param type
   * @param newName
   * @param oldName
   * @returns {Promise}
   * @changed
   */
  rename({ getters, dispatch }, { type, newName, oldName }) {
    return POST.rename({
      disk: getters.selectedDisk,
      newName,
      oldName,
      type,
    })
      .then(response => {
        // refresh content
        if (type === 'dir') {
          dispatch('refreshAll')
        } else {
          dispatch('refreshManagers')
        }

        return response
      })
      .catch(err => {})
  },

  /**
   * Get file url
   * @param store
   * @param disk
   * @param path
   * @returns {Promise}
   * @changed
   */
  url(store, { disk, path }) {
    return GET.url(disk, path)
  },

  /**
   * Zip files and folders
   * @param state
   * @param getters
   * @param dispatch
   * @param name
   * @returns {*|PromiseLike<T | never>|Promise<T | never>}
   * @changed
   */
  zip({ state, getters, dispatch }, name) {
    const selectedDirectory = getters.selectedDirectory

    return POST.zip({
      disk: getters.selectedDisk,
      path: selectedDirectory,
      name,
      elements: state[state.activeManager].selected,
    })
      .then(response => {
        // if zipped successfully
        if (selectedDirectory === getters.selectedDirectory) {
          dispatch('refreshManagers')
        }

        return response
      })
      .catch(err => {})
  },

  /**
   * Unzip selected archive
   * @param getters
   * @param dispatch
   * @param folder
   * @returns {*|PromiseLike<T | never>|Promise<T | never>}
   * @changed
   */
  unzip({ getters, dispatch }, folder) {
    const selectedDirectory = getters.selectedDirectory

    return POST.unzip({
      disk: getters.selectedDisk,
      path: getters.selectedItems[0].path,
      folder,
    })
      .then(response => {
        // if unzipped successfully
        if (selectedDirectory === getters.selectedDirectory) {
          // refresh
          dispatch('refreshAll')
        }

        return response
      })
      .catch(err => {})
  },

  /**
   * Add selected items to clipboard
   * @param state
   * @param commit
   * @param getters
   * @param type
   * @changed
   */
  toClipboard({ state, commit, getters }, type) {
    // if files are selected
    if (getters[`${state.activeManager}/selectedCount`]) {
      commit('setClipboard', {
        type,
        disk: state[state.activeManager].selectedDisk,
        directories: state[state.activeManager].selected.directories.slice(0),
        files: state[state.activeManager].selected.files.slice(0),
      })
    }
  },

  /**
   * Refresh content in the manager/s
   * @param dispatch
   * @param state
   * @returns {*}
   * @changed
   */
  refreshManagers({ dispatch, state }) {
    // select what needs to be an updated
    if (state.settings.windowsConfig === 3) {
      return Promise.all([
        // left manager
        dispatch('left/refreshDirectory'),
        // right manager
        dispatch('right/refreshDirectory'),
      ])
    }

    // only left manager
    return dispatch('left/refreshDirectory')
  },

  /**
   * Refresh All
   * @param state
   * @param getters
   * @param dispatch
   * @returns {*}
   * @changed
   */
  refreshAll({ state, getters, dispatch }) {
    if (state.settings.windowsConfig === 2) {
      // refresh tree
      return dispatch('tree/initTree', state.left.selectedDisk).then(() =>
        Promise.all([
          // reopen folders if need
          dispatch('tree/reopenPath', getters.selectedDirectory),
          // refresh manager/s
          dispatch('refreshManagers'),
        ])
      )
    }
    // refresh manager/s
    return dispatch('refreshManagers')
  },

  /**
   * Repeat sorting
   * @param state
   * @param dispatch
   * @param manager
   * @changed
   */
  repeatSort({ state, dispatch }, manager) {
    dispatch(`${manager}/sortBy`, {
      field: state[manager].sort.field,
      direction: state[manager].sort.direction,
    })
  },

  /**
   * Update content - files, folders after create or update
   * @param state
   * @param commit
   * @param getters
   * @param dispatch
   * @param data
   * @param oldDir
   * @param commitName
   * @param type
   *
   * @changed
   */
  updateContent({ state, commit, getters, dispatch }, { data, oldDir, commitName, type }) {
    // if operation success
    if (oldDir === getters.selectedDirectory) {
      // add/update file/folder in to the files/folders list
      commit(`${state.activeManager}/${commitName}`, data[type])
      // repeat sort
      dispatch('repeatSort', state.activeManager)

      // if tree module is showing
      if (type === 'directory' && state.settings.windowsConfig === 2) {
        // update tree module
        dispatch('tree/addToTree', {
          parentPath: oldDir,
          newDirectory: data.tree,
        })

        // if both managers show the same folder
      } else if (
        state.settings.windowsConfig === 3 &&
        state.left.selectedDirectory === state.right.selectedDirectory &&
        state.left.selectedDisk === state.right.selectedDisk
      ) {
        // add/update file/folder in to the files/folders list (inactive manager)
        commit(`${getters.inactiveManager}/${commitName}`, data[type])
        // repeat sort
        dispatch('repeatSort', getters.inactiveManager)
      }
    }
  },

  /**
   * Reset application state
   * @param state
   * @param commit
   * @changed
   */
  resetState({ state, commit }) {
    // left manager
    commit('left/setDisk', null)
    commit('left/setSelectedDirectory', null)
    commit('left/setDirectoryContent', { directories: [], files: [] })
    commit('left/resetSelected')
    commit('left/resetSortSettings')
    commit('left/resetHistory')
    commit('left/setView', 'table')
    // modals
    commit('modal/clearModal')
    // messages
    commit('messages/clearActionResult')
    commit('messages/clearProgress')
    commit('messages/clearLoading')
    commit('messages/clearErrors')

    if (state.settings.windowsConfig === 3) {
      // right manager
      commit('right/setDisk', null)
      commit('right/setSelectedDirectory', null)
      commit('right/setDirectoryContent', { directories: [], files: [] })
      commit('right/resetSelected')
      commit('right/resetSortSettings')
      commit('right/resetHistory')
      commit('right/setView', 'table')
    } else if (state.settings.windowsConfig === 2) {
      // tree
      commit('tree/cleanTree')
      commit('tree/clearTempArray')
    }

    commit('resetState')
  },

  /**
   * Open PDF
   * @param context
   * @param disk
   * @param path
   */
  openPDF(context, { disk, path }) {
    const win = window.open()

    GET.getFileArrayBuffer(disk, path).then(response => {
      const blob = new Blob([response.data()], { type: 'application/pdf' })

      win.document.write(
        `<iframe src="${URL.createObjectURL(blob)}" allowfullscreen height="100%" width="100%"></iframe>`
      )
    })
  },
}
