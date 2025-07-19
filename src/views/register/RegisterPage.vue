<script setup>
// [逻辑不变] 所有的脚本逻辑、数据、验证规则和方法都保持原样
import { ref } from 'vue'
import { User, Lock, Eleme } from '@element-plus/icons-vue' // 为按钮加载状态增加Eleme图标，与登录页保持一致
import { useRouter } from 'vue-router'
import { registerService } from '@/api/login.js'
import { ElMessage } from 'element-plus' // 确保ElMessage已导入

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  repassword: '',
  role: 2 // 默认选择学生
})

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号必须是3-12位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  role: [{ required: true, message: '请选择注册类型', trigger: 'change' }]
}

const form = ref(null)
const loading = ref(false)

const register = async () => {
  await form.value.validate()
  try {
    loading.value = true
    await registerService(formData.value)
    ElMessage.success('注册成功，即将跳转到登录页')
    router.push('/login')
  } catch (err) {
    // 保持原有错误处理逻辑，此处仅为示例
    console.error(err)
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- [布局重构] 采用与登录页一致的全屏背景容器 -->
  <div class="login-container">
    <!-- [布局重构] 表单包裹在居中的卡片中 -->
    <el-card class="login-card">
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        size="large"
        autocomplete="off"
        class="realForm"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            v-model="formData.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            v-model="formData.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            name="repassword"
            v-model="formData.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- [样式对齐] 角色选择的布局与登录页保持一致 -->
        <el-form-item prop="role" class="flex">
          <div class="mb-2 flex items-center text-sm">
            <el-radio-group v-model="formData.role" class="ml-4">
              <el-radio :label="1" size="large">管理员</el-radio>
              <el-radio :label="2" size="large">学生</el-radio>
              <el-radio :label="3" size="large">教师</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <!-- [样式对齐] 按钮组的布局与登录页保持一致 -->
          <div class="button-group">
            <el-button
              :loading-icon="Eleme"
              :loading="loading"
              class="button"
              type="primary"
              auto-insert-space
              @click="register"
            >
              立即注册
            </el-button>
            <el-button
              class="button"
              type="info"
              auto-insert-space
              @click="$router.push('/login')"
            >
              返回登录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
/* [样式对齐] 完全复用登录页的样式 */

// 全屏背景容器
.login-container {
  width: 100vw;
  height: 100vh;
  // 您可以与登录页使用相同的背景图，或指定一张新的
  background-image: url('@/assets/denglu.jpg'); /* 这里替换为您的图片路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 登录/注册卡片样式
.login-card {
  width: 400px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
}

// 表单内部样式
.realForm {
  width: 100%;
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

// 按钮组样式
.button-group {
  display: flex;
  gap: 12px;
  width: 100%;

  .button {
    flex: 1;
  }
}
</style>