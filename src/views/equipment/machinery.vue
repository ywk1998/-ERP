<template>
  <div class="machinery-page">
    <el-card shadow="never" class="module-card">
      <template #header>
        <span class="card-title">机械设备</span>
      </template>

      <el-row :gutter="16" class="entry-row">
        <el-col
          v-for="item in entries"
          :key="item.path"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <div class="entry-card" @click="go(item.path)">
            <div class="entry-icon">
              <el-icon :size="28"><component :is="item.icon" /></el-icon>
            </div>
            <div class="entry-body">
              <div class="entry-title">{{ item.title }}</div>
              <div class="entry-desc">{{ item.desc }}</div>
            </div>
            <el-icon class="entry-arrow" :size="16"><ArrowRight /></el-icon>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WindPower, Odometer, Tools, ArrowRight } from '@element-plus/icons-vue'

defineOptions({ name: 'EquipmentMachinery' })

const router = useRouter()

interface Entry {
  title: string
  desc: string
  path: string
  icon: unknown
}

const entries: Entry[] = [
  {
    title: '环保信息管理',
    desc: '环保检测、排放信息记录与管理',
    path: '/equipment/machinery/environment',
    icon: WindPower,
  },
  {
    title: '设备加油管理',
    desc: '加油记录、油耗统计与管理',
    path: '/equipment/machinery/refuel',
    icon: Odometer,
  },
  {
    title: '机械设备保养管理',
    desc: '保养计划、保养记录管理',
    path: '/equipment/machinery/maintenance',
    icon: Tools,
  },
]

function go(path: string) {
  router.push(path)
}
</script>

<style scoped lang="scss">
.machinery-page {
  min-height: calc(100vh - 56px - 32px);

  .card-title {
    font-size: 15px;
    font-weight: 600;
  }

  .entry-card {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 92px;
    margin-bottom: 16px;
    padding: 0 16px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--tq-active-color);
      background: var(--tq-gray-hover);
      box-shadow: 0 2px 12px rgba(0, 138, 255, 0.12);
    }

    .entry-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      color: var(--tq-active-color);
      background: var(--tq-active-bg);
      border-radius: 8px;
    }

    .entry-body {
      flex: 1;
      min-width: 0;

      .entry-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--tq-text);
      }

      .entry-desc {
        margin-top: 4px;
        font-size: 12px;
        color: var(--tq-text-secondary);
      }
    }

    .entry-arrow {
      flex-shrink: 0;
      color: var(--tq-text-secondary);
    }
  }
}
</style>
