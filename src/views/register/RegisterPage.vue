<script setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { registerService } from '@/api/login.js'

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
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
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
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (err) {
    throw new Error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-row class="register-page">
    <el-col :span="12">
      <el-carousel :interval="3500" height="100vh" trigger="click">
        <!-- 复用登录页的轮播图 -->
        <el-carousel-item>
          <img src="@/assets/bg.png" alt="" class="img1" />
        </el-carousel-item>
        <el-carousel-item>
          <img src="@/assets/kx.jpg" alt="" class="img2" />
        </el-carousel-item>
      </el-carousel>
    </el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form ref="form" :model="formData" :rules="rules" size="large">
        <el-form-item>
          <h1>用户注册</h1>
        </el-form-item>
        <el-form-item prop="userNum">
          <el-input
            :prefix-icon="User"
            v-model="formData.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            v-model="formData.repassword"
            type="password"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-radio-group v-model="formData.role" class="role-select">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">学生</el-radio>
            <el-radio :label="3">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="button-container">
            <el-button
              type="primary"
              class="register-btn"
              @click="register"
              :loading="loading"
            >
              立即注册
            </el-button>
            <el-button class="return-login" @click="router.push('/login')">
              返回登录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.register-page {
  height: 100vh;
  background-color: #fff;
  .img1,
  .img2 {
    width: 100%;
    height: 100%;
  }

  .img1 {
    object-fit: fill;
  }

  .img2 {
    object-fit: cover;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
  }

  .role-select {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .register-btn {
    width: 100%;
  }
}

.button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .return-login {
    width: 80%;
    margin-top: 10px;
  }
}
</style>
