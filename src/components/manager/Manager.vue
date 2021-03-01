<template>
  <div class="fm-content d-flex flex-column">
    <disk-list :manager="manager" />
    <breadcrumb :manager="manager" />
    <div class="fm-content-body">
      <table-view v-if="isViewTable" v-bind:manager="manager" />
      <grid-view v-else-if="isViewGrid" v-bind:manager="manager" />
    </div>
  </div>
</template>

<script>
// Components
import DiskList from './DiskList.vue'
import Breadcrumb from './Breadcrumb.vue'
import TableView from './TableView.vue'
import GridView from './GridView.vue'

export default {
  name: 'Manager',
  components: {
    DiskList,
    Breadcrumb,
    TableView,
    GridView,
  },
  props: {
    manager: {
      type: String,
      required: true,
    },
  },
  computed: {
    /**
     * view type - grid or table
     * @returns {default.computed.viewType|(function())|string}
     */
    isViewTable() {
      return this.$store.getters[`fm/${this.manager}/isViewTable`]
    },
    isViewGrid() {
      return this.$store.getters[`fm/${this.manager}/isViewGrid`]
    },
  },
}
</script>

<style lang="scss">
.fm-content {
  height: 100%;
  padding-left: 1rem;

  .fm-content-body {
    overflow: auto;
  }
}
</style>
