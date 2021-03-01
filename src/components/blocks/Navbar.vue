<template>
  <div class="fm-navbar mb-3">
    <div class="row justify-content-between">
      <div class="col-auto">
        <el-button-group>
          <el-button icon="el-icon-back" :disabled="backDisabled" :title="lang.btn.back" @click="historyBack()" />
          <el-button
            icon="el-icon-right"
            :disabled="forwardDisabled"
            :title="lang.btn.forward"
            @click="historyForward()"
          />
          <el-button icon="el-icon-refresh" @click="refreshAll()" :title="lang.btn.refresh" />
        </el-button-group>

        <el-button-group>
          <el-button icon="el-icon-document-add" @click="showModal('NewFile')" :title="lang.btn.file" />
          <el-button icon="el-icon-folder-add" @click="showModal('NewFolder')" :title="lang.btn.folder" />
          <el-button
            icon="el-icon-upload"
            :title="lang.btn.upload"
            :disabled="uploading"
            @click="!uploading ? showModal('Upload') : null"
          />
          <el-button
            icon="el-icon-delete"
            v-bind:disabled="!isAnyItemSelected"
            v-on:click="showModal('Delete')"
            v-bind:title="lang.btn.delete"
          />
        </el-button-group>

        <el-button-group>
          <el-button
            icon="el-icon-document-copy"
            v-bind:disabled="!isAnyItemSelected"
            v-bind:title="lang.btn.copy"
            v-on:click="toClipboard('copy')"
          />
          <el-button
            icon="el-icon-scissors"
            v-bind:disabled="!isAnyItemSelected"
            v-bind:title="lang.btn.cut"
            v-on:click="toClipboard('cut')"
          />
          <el-button
            icon="el-icon-files"
            v-bind:disabled="!clipboardType"
            v-bind:title="lang.btn.paste"
            v-on:click="paste"
          />
        </el-button-group>

        <el-button-group>
          <el-button
            :type="hiddenFiles ? 'default' : 'info'"
            icon="el-icon-view"
            v-bind:title="lang.btn.hidden"
            v-on:click="toggleHidden"
          />
        </el-button-group>

        <!--<div class="btn-group" role="group">
          <button type="button" class="btn btn-secondary" v-bind:title="lang.btn.hidden" v-on:click="toggleHidden">
            <i class="fas" v-bind:class="[hiddenFiles ? 'fa-eye' : 'fa-eye-slash']" />
          </button>
        </div>-->
      </div>
      <div class="col-auto text-right">
        <el-button-group>
          <el-button
            :type="viewType === 'table' ? 'default' : 'info'"
            v-on:click="selectView('table')"
            v-bind:title="lang.btn.table"
          >
            <i class="fas" v-bind:class="[viewType === 'table' ? 'fa-th-list' : 'fa-th']" />
          </el-button>

          <el-button
            icon="el-icon-full-screen"
            :type="fullScreen ? 'default' : 'primary'"
            v-bind:title="lang.btn.fullScreen"
            v-on:click="screenToggle"
          />
        </el-button-group>

        <!--<div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-secondary"
            v-bind:class="[viewType === 'table' ? 'active' : '']"
            v-on:click="selectView('table')"
            v-bind:title="lang.btn.table"
          >
            <i class="fas fa-th-list" />
          </button>
          <button
            role="button"
            class="btn btn-secondary"
            v-bind:class="[viewType === 'grid' ? 'active' : '']"
            v-on:click="selectView('grid')"
            v-bind:title="lang.btn.grid"
          >
            <i class="fas fa-th" />
          </button>
        </div>-->
        <!--<div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-secondary"
            v-bind:title="lang.btn.fullScreen"
            v-bind:class="{ active: fullScreen }"
            v-on:click="screenToggle"
          >
            <i class="fas fa-expand-arrows-alt" />
          </button>
        </div>
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-secondary" v-bind:title="lang.btn.about" v-on:click="showModal('About')">
            <i class="fas fa-question" />
          </button>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import translate from '../../mixins/translate'
import EventBus from '../../eventBus'

export default {
  mixins: [translate],
  computed: {
    /**
     * Active manager name
     * @returns {default.computed.activeManager|(function())|string|activeManager}
     */
    activeManager() {
      return this.$store.state.fm.activeManager
    },

    /**
     * Back button state
     * @returns {boolean}
     */
    backDisabled() {
      return !this.$store.state.fm[this.activeManager].historyPointer
    },

    /**
     * Forward button state
     * @returns {boolean}
     */
    forwardDisabled() {
      return (
        this.$store.state.fm[this.activeManager].historyPointer ===
        this.$store.state.fm[this.activeManager].history.length - 1
      )
    },

    /**
     * Is any files or directories selected?
     * @returns {boolean}
     */
    isAnyItemSelected() {
      return (
        this.$store.state.fm[this.activeManager].selected.files.length > 0 ||
        this.$store.state.fm[this.activeManager].selected.directories.length > 0
      )
    },

    /**
     * Manager view type - grid or table
     * @returns {default.computed.viewType|(function())|string}
     */
    viewType() {
      return this.$store.state.fm[this.activeManager].viewType
    },

    /**
     * Upload files
     * @returns {boolean}
     */
    uploading() {
      return this.$store.state.fm.messages.actionProgress > 0
    },

    /**
     * Clipboard - action type
     * @returns {null}
     */
    clipboardType() {
      return this.$store.state.fm.clipboard.type
    },

    /**
     * Full screen status
     * @returns {default.computed.fullScreen|(function())|boolean|fullScreen|*|string}
     */
    fullScreen() {
      return this.$store.state.fm.fullScreen
    },

    /**
     * Show or Hide hidden files
     * @returns {boolean}
     */
    hiddenFiles() {
      return this.$store.state.fm.settings.hiddenFiles
    },
  },
  methods: {
    /**
     * Refresh file manager
     */
    refreshAll() {
      this.$store.dispatch('fm/refreshAll')
    },

    /**
     * History back
     */
    historyBack() {
      this.$store.dispatch(`fm/${this.activeManager}/historyBack`)
    },

    /**
     * History forward
     */
    historyForward() {
      this.$store.dispatch(`fm/${this.activeManager}/historyForward`)
    },

    /**
     * Copy
     * @param type
     */
    toClipboard(type) {
      this.$store.dispatch('fm/toClipboard', type)

      // show notification
      if (type === 'cut') {
        EventBus.$emit('addNotification', {
          status: 'success',
          message: this.lang.notifications.cutToClipboard,
        })
      } else if (type === 'copy') {
        EventBus.$emit('addNotification', {
          status: 'success',
          message: this.lang.notifications.copyToClipboard,
        })
      }
    },

    /**
     * Paste
     */
    paste() {
      this.$store.dispatch('fm/paste')
    },

    /**
     * Set Hide or Show hidden files
     */
    toggleHidden() {
      this.$store.commit('fm/settings/toggleHiddenFiles')
    },

    /**
     * Show modal window
     * @param modalName
     */
    showModal(modalName) {
      // show selected modal
      this.$store.commit('fm/modal/setModalState', {
        modalName,
        show: true,
      })
    },

    /**
     * Select view type
     * @param type
     */
    selectView(type) {
      if (this.viewType !== type) this.$store.commit(`fm/${this.activeManager}/setView`, type)
    },

    /**
     * Full screen toggle
     */
    screenToggle() {
      const fm = document.getElementsByClassName('fm')[0]

      if (!this.fullScreen) {
        if (fm.requestFullscreen) {
          fm.requestFullscreen()
        } else if (fm.mozRequestFullScreen) {
          fm.mozRequestFullScreen()
        } else if (fm.webkitRequestFullscreen) {
          fm.webkitRequestFullscreen()
        } else if (fm.msRequestFullscreen) {
          fm.msRequestFullscreen()
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }

      this.$store.commit('fm/screenToggle')
    },
  },
}
</script>

<style lang="scss">
.fm-navbar {
  .btn-group {
    margin-right: 0.4rem;
  }
}
</style>
