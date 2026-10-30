<template>
  <div class="page-placeholder">
    <el-card shadow="never">
      <template #header>
        <span>环保信息管理</span>
      </template>
      <el-empty description="环保信息管理模块开发中，敬请期待..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MachineryEnvironment' })
</script>

<style scoped lang="scss">
.page-placeholder {
  min-height: calc(100vh - 56px - 32px);
}
</style>
