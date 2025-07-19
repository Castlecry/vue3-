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
        <el-menu-item index="/student/aiol">
          <el-icon><Promotion /></el-icon>
          <span>在线学习助手</span>
        </el-menu-item>
        <el-menu-item index="/student/onlinepractise">
          <el-icon><Promotion /></el-icon>
          <span>实时练习评测助手</span>
        </el-menu-item>
        <el-menu-item index="/student/queryWork">
          <el-icon><Promotion /></el-icon>
          <span>作业</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="mainHeader">
        <div>
          <!-- 这里应用了新的样式类 -->
          <div class="system-title">教学实训智能体系统</div>
        </div>
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

/* [新增] 从您的参考代码中复制过来的样式 */
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