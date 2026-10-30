<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-card">
      <!-- 左侧品牌区 -->
      <div class="brand-panel">
        <div class="brand-logo">
          <el-icon :size="42"><Monitor /></el-icon>
        </div>
        <h1 class="brand-title">天衢 ERP</h1>
        <p class="brand-subtitle">企业资源计划管理系统</p>
        <ul class="brand-features">
          <li><el-icon><CircleCheckFilled /></el-icon>采购 · 销售 · 库存一体化</li>
          <li><el-icon><CircleCheckFilled /></el-icon>生产计划与财务管理</li>
          <li><el-icon><CircleCheckFilled /></el-icon>多角色权限精细管控</li>
          <li><el-icon><CircleCheckFilled /></el-icon>实时报表与数据洞察</li>
        </ul>
      </div>

      <!-- 右侧表单区 -->
      <div class="form-panel">
        <h2 class="form-title">欢迎登录</h2>
        <p class="form-desc">请输入账号信息进入系统</p>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="loginRules"
          size="large"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginForm.username"
              placeholder="请输入账号"
              :prefix-icon="User"
              clearable
              autocomplete="username"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              autocomplete="current-password"
            />
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-wrapper">
              <el-input
                v-model.trim="loginForm.captcha"
                placeholder="验证码"
                :prefix-icon="Key"
                clearable
                maxlength="4"
                @input="loginForm.captcha = loginForm.captcha.toUpperCase()"
              />
              <canvas
                ref="captchaRef"
                class="captcha-canvas"
                width="110"
                height="40"
                title="点击刷新验证码"
                @click="drawCaptcha"
              />
            </div>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住账号</el-checkbox>
          </div>

          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form>

        <div class="login-tip">
          演示账号：<b>admin</b> / 密码：<b>123456</b>
        </div>
      </div>
    </div>

    <div class="login-footer">© 2026 天衢ERP · TianQu Enterprise Resource Planning</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Lock, Key } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'LoginPage' })

const REMEMBER_KEY = 'tq_erp_remember_username'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const captchaRef = ref<HTMLCanvasElement>()
const loading = ref(false)
const rememberMe = ref(false)

/** 当前验证码正确答案 */
let captchaCode = ''

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
})

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6 - 20 位', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码为 4 位', trigger: 'blur' },
  ],
}

/** 生成并绘制 4 位图形验证码 */
function drawCaptcha() {
  const canvas = captchaRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaCode = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')

  const width = canvas.width
  const height = canvas.height

  // 背景
  ctx.fillStyle = '#f0f4fa'
  ctx.fillRect(0, 0, width, height)

  // 干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(64,128,255,${0.2 + Math.random() * 0.3})`
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }

  // 字符
  const colors = ['#4080ff', '#3ec5b0', '#f5a623', '#8a6fe8']
  captchaCode.split('').forEach((char, i) => {
    ctx.save()
    ctx.fillStyle = colors[i % colors.length]
    ctx.font = `bold ${20 + Math.floor(Math.random() * 4)}px Arial`
    ctx.translate(18 + i * 24, height / 2)
    ctx.rotate(((Math.random() - 0.5) * 30 * Math.PI) / 180)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(char, 0, 0)
    ctx.restore()
  })

  // 噪点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
  }

  // 输入后清空旧值，避免长度不匹配
  loginForm.captcha = ''
}

/** 登录 */
async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (loginForm.captcha.toUpperCase() !== captchaCode) {
    ElMessage.error('验证码错误，请重新输入')
    drawCaptcha()
    return
  }

  loading.value = true
  try {
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password,
    })

    // 记住账号
    if (rememberMe.value) {
      localStorage.setItem(REMEMBER_KEY, loginForm.username)
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }

    ElMessage.success('登录成功')
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请重试')
    drawCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 回填记住的账号
  const remembered = localStorage.getItem(REMEMBER_KEY)
  if (remembered) {
    loginForm.username = remembered
    rememberMe.value = true
  }
  drawCaptcha()
})
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1d39c4 0%, #2f54eb 40%, #4080ff 100%);
}

/* 背景装饰圆 */
.bg-decoration {
  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);

    &.circle-1 {
      top: -120px;
      left: -120px;
      width: 400px;
      height: 400px;
    }
    &.circle-2 {
      right: -160px;
      bottom: -160px;
      width: 500px;
      height: 500px;
    }
    &.circle-3 {
      top: 30%;
      right: 15%;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

.login-card {
  position: relative;
  z-index: 1;
  display: flex;
  width: 860px;
  max-width: calc(100vw - 32px);
  min-height: 480px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 左侧品牌区 */
.brand-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
  color: #fff;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));

  .brand-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-bottom: 20px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(6px);
  }

  .brand-title {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  .brand-subtitle {
    margin: 10px 0 36px;
    font-size: 14px;
    opacity: 0.85;
    letter-spacing: 4px;
  }

  .brand-features {
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      font-size: 14px;
      opacity: 0.9;

      .el-icon {
        color: #95de64;
      }
    }
  }
}

/* 右侧表单区 */
.form-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 400px;
  padding: 48px 44px;
  background: #fff;

  .form-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .form-desc {
    margin: 8px 0 28px;
    font-size: 13px;
    color: #909399;
  }

  .captcha-wrapper {
    display: flex;
    gap: 10px;
    width: 100%;

    .el-input {
      flex: 1;
    }

    .captcha-canvas {
      flex-shrink: 0;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      cursor: pointer;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .login-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    letter-spacing: 6px;
  }

  .login-tip {
    margin-top: 20px;
    padding: 8px 12px;
    font-size: 12px;
    color: #909399;
    text-align: center;
    background: #f5f7fa;
    border-radius: 4px;

    b {
      color: #4080ff;
    }
  }
}

.login-footer {
  position: absolute;
  bottom: 16px;
  z-index: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* 响应式：小屏隐藏品牌区 */
@media (max-width: 768px) {
  .login-card {
    width: 400px;
    min-height: auto;
  }
  .brand-panel {
    display: none;
  }
  .form-panel {
    width: 100%;
    padding: 40px 32px;
  }
}
</style>
