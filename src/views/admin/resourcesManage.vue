<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { View } from '@element-plus/icons-vue' // 详情图标
import { getSubjectListService } from '@/api/admin.js' // 假设的学科列表接口
import { useRouter } from 'vue-router'

// 状态管理
const subjectList = ref([])
const isLoading = ref(false)
const router = useRouter()

// 获取学科列表数据时，格式化数据
const getSubjectList = async () => {
  isLoading.value = true
  try {
    const resp = await getSubjectListService()
    subjectList.value = resp.data.map(subjectName => ({
    name: subjectName
    }))
  } catch (error) {
    console.error('获取学科列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 初始化加载数据
getSubjectList()

// 点击详情跳转
const goToDetail = (name) => {
  router.push(`/admin/detail/${name}`) // 跳转到详情页，携带学科
}
</script>

<template>
  <PageContainer title="教学资源管理页面">
    <template #extra>    
    </template>
    <!-- 学科列表表格 -->
    <el-table 
      v-loading="isLoading" 
      :data="subjectList" 
      style="width: 100%"
      border
    >
      <el-table-column 
        prop="name" 
        label="学科名称"
        width="200"
      ></el-table-column>
      <el-table-column 
        label="操作" 
        width="150"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            :icon="View"
            circle
            plain
            @click="goToDetail(row.name)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无学科数据"></el-empty>
      </template>
    </el-table>
  </PageContainer>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  margin-bottom: 20px; // 与表格保持间距
}
</style>