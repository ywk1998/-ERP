<template>
  <div class="page-placeholder">
    <el-card shadow="never">
      <template #header>
        <span>机械设备保养管理</span>
      </template>
      <el-empty description="机械设备保养管理模块开发中，敬请期待..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MachineryMaintenance' })
</script>

<style scoped lang="scss">
.page-placeholder {
  min-height: calc(100vh - 56px - 32px);
}
</style>
