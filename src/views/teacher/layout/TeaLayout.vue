<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { logoutService } from '@/api/login.js'
import { useRouter } from 'vue-router'

//两个需要导入的element组件
import { Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

//设置用户名字
const userName = ref('')
const userStore = useUserStore()
userName.value = userStore.userName

//登出功能
const router = useRouter()
const logout = async () => {
  ElMessage.success('登出成功')
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/teacher/situationassessment">
          <el-icon><Promotion /></el-icon>
          <span>学生学情评估</span>
        </el-menu-item>
        <el-menu-item index="/teacher/aimake">
          <el-icon><Promotion /></el-icon>
          <span>ai制作考核</span>
        </el-menu-item>
        <el-menu-item index="/teacher/PreDesign">
          <el-icon><Promotion /></el-icon>
          <span>备课与设计</span>
        </el-menu-item>
        <el-menu-item index="/teacher/questionfork">
          <el-icon><Promotion /></el-icon>
          <span>题库</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="mainHeader">
          <div class="system-title">教学实训智能体系统</div>
        <div style="display: flex; align-items: center">
          <div></div>
          <div style="margin-left: 10px">
            <el-button type="primary" @click="logout">登出</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>智能平台 ©2025 Created by 502C组</el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      // background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: rgb(4, 131, 213);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}

.mainHeader {
  display: flex;
  justify-content: space-between;
  background-color: rgb(4, 131, 213);
}

.system-title {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>
