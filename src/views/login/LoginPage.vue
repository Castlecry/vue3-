<script setup>
// 此处脚本逻辑完全不变，省略（与原代码一致）
import { ref } from 'vue'
import { User, Lock, Eleme } from '@element-plus/icons-vue'
import { loginService } from '@/api/login.js'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const loading = ref(false)
const fromData = ref({
  username: '',
  password: '',
  role: 2
})
const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号必须是3-12位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{3,15}$/,
      message: '密码必须是3-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== fromData.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const testAccounts = {
  student: { username: 'student', password: '123456', role: 2 },
  teacher: { username: 'teacher', password: '123456', role: 3 },
  admin: { username: 'Admin', password: '123456', role: 1 }
}
const form = ref(null)
const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  try {
    const resp = await loginService(fromData.value)
    ElMessage.success('登录成功')
    userStore.setToken(resp.data.access_token)
    userStore.setUserId(resp.data.userid)
    userStore.setUserName(resp.data.username)
    if (fromData.value.role === 2) {
      router.push('/student')
    } else if (fromData.value.role === 1) {
      router.push('/admin/StuManage')
    } else if (fromData.value.role === 3) {
      router.push('/teacher')
    }
  } catch (err) {
    console.error('登录API调用失败:', err)
    if (err.response && err.response.data && err.response.data.detail) {
      ElMessage.error(err.response.data.detail)
    } else {
      ElMessage.error('登录请求失败，请稍后重试。')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 外层容器：全屏背景 + 居中表单 -->
  <div class="login-container">
    <!-- 登录表单卡片 -->
    <el-card class="login-card">
      <el-form
        ref="form"
        :model="fromData"
        :rules="rules"
        size="large"
        autocomplete="off"
        class="realForm"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username"> <!-- 修正原代码的prop拼写错误（userNum→username） -->
          <el-input
            :prefix-icon="User"
            v-model="fromData.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            v-model="fromData.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="mb-2 flex items-center text-sm">
            <el-radio-group v-model="fromData.role" class="ml-4">
              <el-radio :label="1" size="large">管理员</el-radio>
              <el-radio :label="2" size="large">学生</el-radio>
              <el-radio :label="3" size="large">教师</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="button-group">
            <el-button
              :loading-icon="Eleme"
              :loading="loading"
              class="button"
              type="primary"
              auto-insert-space
              @click="login"
              >登录</el-button
            >
            <el-button
              class="button"
              type="info"
              auto-insert-space
              @click="$router.push('/register')"
            >
              注册
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
// 全屏背景容器
.login-container {
  // 占满整个屏幕
  width: 100vw;
  height: 100vh;
  // 背景图设置（替换成你的图片路径）
  background-image: url('@/assets/denglu.jpg'); /* 这里替换为你的图片路径 */
  background-size: cover; /* 背景图自适应拉伸，保持比例填满屏幕 */
  background-position: center; /* 背景图居中显示 */
  background-repeat: no-repeat; /* 背景图不重复 */
  // 启用flex布局，让子元素居中
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  // 可选：加一层半透明遮罩，让表单更清晰
  // background-color: rgba(0, 0, 0, 0.3); /* 黑色半透明遮罩 */
}

// 登录卡片样式
.login-card {
  width: 400px; /* 表单宽度，可根据需要调整 */
  padding: 30px; /* 内部间距 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* 卡片阴影，增强立体感 */
  background-color: rgba(255, 255, 255, 0.6); /* 卡片背景半透明，可选 */
}

// 表单内部样式（复用原样式，微调）
.realForm {
  width: 100%;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.button-group {
  display: flex;
  gap: 12px;
  width: 100%;

  .button {
    flex: 1;
  }
}
</style>