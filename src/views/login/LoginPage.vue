<script setup>
import { ref } from 'vue'
import { User, Lock, Eleme } from '@element-plus/icons-vue'
import { loginService } from '@/api/login.js'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

// 加载状态
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
          callback() //校验成功也得callback
        }
      },
      trigger: 'blur'
    }
  ]
}
const testAccounts = {
  student: {
    username: 'student',
    password: '123456',
    role: 2
  },
  teacher: {
    username: 'teacher',
    password: '123456',
    role: 3
  },
  admin: {
    username: 'Admin',
    password: '123456',
    role: 1
  }
}
const form = ref(null)
//登录功能
const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  //在该区域写登录测试账号
  //  const matchedAccount = Object.values(testAccounts).find(
  //    (account) =>
  //      account.username === fromData.value.username &&
  //      account.password === fromData.value.password
  //  )
  //  if (matchedAccount) {
  //    // 根据角色跳转
  //    ElMessage.success('登录成功')
  //    if (matchedAccount.role === 2) {
  //      router.push('/student')
  //    } else if (matchedAccount.role === 3) {
  //      router.push('/teacher')
  //    } else if (matchedAccount.role === 1) {
  //      router.push('/admin')
  //    }
  //    userStore.setUserId(matchedAccount.userid)
  //    userStore.setUserName(matchedAccount.username)
  //    return // 匹配成功后直接返回，不执行后续逻辑
  //  }
  await form.value.validate()
  try {
    // 调用API
    const resp = await loginService(fromData.value)

    // 登录成功逻辑
    ElMessage.success('登录成功')
    userStore.setToken(resp.data.access_token)
    userStore.setUserId(resp.data.userid)
    userStore.setUserName(resp.data.username)

    console.log(resp.data)
    // 根据角色进行跳转
    if (fromData.value.role === 2) {
      router.push('/student')
    } else if (fromData.value.role === 1) {
      // 修正变量名
      router.push('/admin/StuManage')
    } else if (fromData.value.role === 3) {
      // 修正变量名
      router.push('/teacher')
    }
  } catch (err) {
    // --- 这是修改后的错误处理逻辑 ---
    console.error('登录API调用失败:', err) // 在控制台打印详细错误，方便调试

    // 从错误对象中提取后端返回的错误信息来提示用户
    // axios的错误通常在 err.response.data.detail 中
    if (err.response && err.response.data && err.response.data.detail) {
      ElMessage.error(err.response.data.detail)
    } else {
      // 其他未知错误
      ElMessage.error('登录请求失败，请稍后重试。')
    }
    // 注意：这里不再有 throw new Error(err)
  } finally {
    // --- 无论成功或失败，最后都停止加载 ---
    loading.value = false
  }
}

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12">
      <el-carousel :interval="3500" height="100vh" trigger="click">
        <el-carousel-item>
          <img src="@/assets/bg.png" alt="" class="img1" />
        </el-carousel-item>
        <el-carousel-item>
          <img src="@/assets/kx.jpg" alt="" class="img2" />
        </el-carousel-item>
      </el-carousel>
    </el-col>
    <el-col :span="6" :offset="3" class="form">
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
        <el-form-item prop="userNum">
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
              <!-- 修改这里 -->
              注册
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.login-page {
  .img1 {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  .img2 {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 或其他适当的值 */
  }

  // elementui布局横向全部填充满，纵向需要用户设置
  height: 100vh;
  background-color: #fff;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    //表单项下面只能有一个元素，设置布局在这个元素身上设置。比如最后“注册”，如果想再设置需要用div
    .flex {
      //这个100%也有助于组件分开位置
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
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
