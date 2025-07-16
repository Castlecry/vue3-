<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { getTeacherListService, deleteTeacherService } from '@/api/admin.js'
import TechEdit from './components/TechEdit.vue'
import PasswordModal from './components/PasswordModal1.vue' // 新增密码修改组件

const search = ref('')
const techList = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 新增密码修改相关状态
const passwordModalRef = ref(null)

// 总页数 = 总数据条数 ÷ 每页条数（向上取整）
const totalPages = Math.ceil(total.value / pageSize.value)

// 查询开课表 单表查询
const gettechList = async () => {
  isLoading.value = true
  const resp = await getTeacherListService({
    search: search.value,
    page: currentPage.value,
    role: 'teacher'
  })
  techList.value = resp.data.users
  total.value = resp.data.total
  isLoading.value = false
}

gettechList()

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    gettechList()
  }
}

const handleNextPage = () => {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) { // 当前页 < 总页数时可点击
    currentPage.value++
    gettechList()
  }
}

//修改组件提交之后，进行刷新
const OnSubmit = () => {
  gettechList()
}

//添加课程
const editRef = ref(null)
const addTeacher = () => {
  editRef.value.open()
}
//修改课程
const editStudent = (row) => {
  editRef.value.open(row)
}
//删除学生
const removeTeacher = (id) => {
  ElMessageBox.confirm('确认删除这个老师信息吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      //1.发送删除学生信息
      await deleteTeacherService(id)
      //2.如果能拿到数据，返回删除成功
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      //3.再次发送请求获取数据
      gettechList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

// 新增：打开密码修改模态框
const openPasswordModal = (row) => {
  passwordModalRef.value.open(row)
}

// 新增：处理密码修改成功后的回调
const handlePasswordUpdateSuccess = () => {
  ElMessage({
    type: 'success',
    message: '密码修改成功'
  })
  gettechList() // 刷新列表
}
</script>

<template>
   <PageContainer title="教师管理页面"> 
    <template #extra>
      <div class="header">
        <el-input placeholder="请输入教师名" v-model="search"></el-input> <!-- 修正：v-model绑定到search -->
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="gettechList()"
          >查询</el-button
        >
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="addTeacher()"
          >新增/修改教师信息</el-button
        >
      </div>
      <!-- 分页控件 -->
<div class="pagination" style="margin-top: 20px; text-align: center;">
  <el-button 
    type="primary" 
    plain 
    @click="handlePrevPage" 
    :disabled="currentPage === 1"
  >
    上一页
  </el-button>
  <span style="margin: 0 10px;">
    第 {{ currentPage }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页
  </span>
  <el-button 
    type="primary" 
    plain 
    @click="handleNextPage" 
    :disabled="currentPage >= Math.ceil(total / pageSize)"
  >
    下一页
  </el-button>
</div>
    </template>

    <el-table v-loading="isLoading" :data="techList" style="width: 100%">
      <el-table-column
        prop="id"
        label="教师ID"
        width="200"
      ></el-table-column>
      <el-table-column prop="username" label="教师姓名"></el-table-column>
      <el-table-column label="操作" width="250"> <!-- 调整宽度 -->
        <template #default="{ row }">
          <el-button
            type="warning"
            :icon="Key"
            circle
            plain
            @click="openPasswordModal(row)"
          >
            修改密码
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click="removeTeacher(row.id)"
            style="margin-left: 8px"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <!-- 修改/新增表单 -->
    <TechEdit ref="editRef" @success="OnSubmit"></TechEdit>
    
    <!-- 新增：密码修改模态框 -->
    <PasswordModal 
      ref="passwordModalRef" 
      @success="handlePasswordUpdateSuccess"
    ></PasswordModal>
  </PageContainer>
</template>

<style scoped lang="scss">
.header {
  display: flex;
}
</style>