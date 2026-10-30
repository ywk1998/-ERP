<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="layout-aside">
      <div class="logo">
        <el-icon :size="26" color="#ffffff"><Monitor /></el-icon>
        <span class="logo-text">天衢 ERP</span>
      </div>
      <el-menu
        :default-active="route.path"
        router
        background-color="#008aff"
        text-color="var(--tq-menu-text)"
        active-text-color="#008aff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>工作台</span>
        </el-menu-item>
        <el-sub-menu index="/equipment">
          <template #title>
            <el-icon><Cpu /></el-icon>
            <span>设备管理</span>
          </template>
          <el-menu-item index="/equipment/machinery">机械设备</el-menu-item>
          <el-menu-item index="/equipment/office">办公设备</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/base">
          <el-icon><Files /></el-icon>
          <span>基础数据</span>
        </el-menu-item>
        <el-menu-item index="/system">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header class="layout-header">
        <div class="header-left">天衢企业资源计划管理系统</div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><UserFilled /></el-icon>
              {{ userStore.nickname || '用户' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 标签栏：已打开的页面（可切换 / 可关闭 / 本地持久化） -->
      <div class="layout-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.path"
          class="tab-item"
          :class="{ 'is-active': tab.path === route.path }"
          @click="router.push(tab.path)"
        >
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon class="tab-close" @click.stop="closeTab(tab.path)">
            <Close />
          </el-icon>
        </div>
      </div>

      <!-- 主内容区 -->
      <el-main class="layout-main">
        <router-view v-if="tabs.length" />
        <el-empty v-else description="请从左侧菜单选择功能" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'LayoutIndex' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface TabItem {
  path: string
  title: string
}

/** 标签持久化 key */
const TABS_KEY = 'TQ_TABS'

const tabs = ref<TabItem[]>([])

/** 读取本地保存的标签 */
function loadTabs(): TabItem[] {
  try {
    const raw = localStorage.getItem(TABS_KEY)
    return raw ? (JSON.parse(raw) as TabItem[]) : []
  } catch {
    return []
  }
}

/** 写入本地 */
function saveTabs() {
  localStorage.setItem(TABS_KEY, JSON.stringify(tabs.value))
}

tabs.value = loadTabs()

/** 把当前路由加入标签栏（已存在则只更新标题） */
function addTab() {
  const title = (route.meta.title as string) || ''
  if (!title) return
  const exist = tabs.value.find((t) => t.path === route.path)
  if (exist) {
    if (exist.title !== title) {
      exist.title = title
      saveTabs()
    }
    return
  }
  tabs.value.push({ path: route.path, title })
  saveTabs()
}

/** 关闭标签：关闭当前页时自动切换到相邻标签；全部关闭则显示空状态 */
function closeTab(path: string) {
  const index = tabs.value.findIndex((t) => t.path === path)
  if (index === -1) return

  const isCurrent = path === route.path
  tabs.value.splice(index, 1)
  saveTabs()

  if (isCurrent) {
    const next = tabs.value[index] || tabs.value[tabs.value.length - 1]
    if (next) {
      router.push(next.path)
    }
  }
}

// 首次进入与路由变化时同步标签
addTab()
watch(() => route.path, addTab)

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        userStore.logout()
        localStorage.removeItem(TABS_KEY)
        ElMessage.success('已退出登录')
        router.push('/login')
      })
      .catch(() => {})
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
}

.layout-aside {
  background: var(--tq-primary-deep);

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 56px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
    }
  }

  .el-menu {
    border-right: none;
    background-color: var(--tq-primary-deep);

    // 选中项：沿用全局选中态规范（--tq-active-bg / --tq-active-color / --tq-active-weight）
    .el-menu-item.is-active {
      background: var(--tq-active-bg) !important;
      color: var(--tq-active-color) !important;
      font-weight: var(--tq-active-weight);
    }

    // 悬停：半透明浅灰底 + 主题蓝文字（与选中态同色系，保证浅底可读）
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
      background: var(--tq-gray-hover) !important;
      color: var(--tq-active-color);

      .el-icon {
        color: var(--tq-active-color);
      }
    }
  }
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;

  .header-left {
    font-size: 15px;
    font-weight: 600;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #303133;
    outline: none;
  }
}

/* 标签栏 */
.layout-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  overflow-x: auto;

  .tab-item {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    height: 26px;
    padding: 0 8px 0 12px;
    font-size: 13px;
    color: var(--tq-text-secondary);
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--tq-gray-hover);
      color: var(--tq-active-color);
    }

    // 当前标签：沿用全局选中态规范
    &.is-active {
      background: var(--tq-active-bg);
      color: var(--tq-active-color);
      border-color: var(--tq-active-color);
      font-weight: var(--tq-active-weight);
    }

    .tab-close {
      font-size: 12px;
      border-radius: 50%;
      padding: 1px;

      &:hover {
        color: #fff;
        background: var(--tq-primary-deep);
      }
    }
  }
}

.layout-main {
  background: #f5f7fa;
  padding: 16px;
}
</style>
