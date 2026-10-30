<template>
  <div class="page-placeholder">
    <el-card shadow="never">
      <template #header>
        <span>系统设置</span>
      </template>
      <el-empty description="系统设置模块开发中，敬请期待..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SystemIndex' })
</script>

<style scoped lang="scss">
.page-placeholder {
  min-height: calc(100vh - 56px - 32px);
}
</style>
