<template>
  <div class="page-placeholder">
    <el-card shadow="never">
      <template #header>
        <span>办公设备</span>
      </template>
      <el-empty description="办公设备模块开发中，敬请期待..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'EquipmentOffice' })
</script>

<style scoped lang="scss">
.page-placeholder {
  min-height: calc(100vh - 56px - 32px);
}
</style>
