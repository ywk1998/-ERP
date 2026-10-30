<template>
  <div class="dashboard">
    <el-card shadow="never">
      <template #header>
        <span>工作台</span>
      </template>
      <el-empty description="仪表盘模块开发中，敬请期待..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardIndex' })
</script>

<style scoped lang="scss">
.dashboard {
  min-height: calc(100vh - 56px - 32px);
}
</style>
