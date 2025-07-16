<template>
  <PageContainer :title="`${subjectName} - 教案详情`">
    <template #extra>
      <div class="header">
        <el-button
          type="default"
          style="margin-left: 20px"
          @click="goBack"
        >
          返回列表
        </el-button>

        <!-- 分页控件 -->
        <div class="pagination" style="margin-left: auto">
          <el-button
            type="primary"
            plain
            @click="handlePrevPage"
            :disabled="currentPage === 1"
          >
            上一页
          </el-button>
          <span style="margin: 0 10px">
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
      </div>
    </template>

    <!-- 教案列表表格 -->
    <el-table
      v-loading="isLoading"
      :data="planList"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="资源名称"
        min-width="300"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="250" 
      >
        <template #default="{ row }">
          <!-- 详情按钮：跳转至教案内容页 -->
          <el-button
            type="primary"
            :icon="Document" 
            circle
            plain
            @click="goToPlanDetail(row.resource_type,row.id)"
            tooltip="查看内容"
          >
            详情
          </el-button>
          
          <!-- 导出单个教案按钮 -->
          <el-button
            type="success"
            :icon="Download"
            circle
            plain
            style="margin-left: 8px"
            @click="exportSinglePlan(row.resource_type, row.id)"
          >
            导出
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="暂无教案数据"></el-empty>
      </template>
    </el-table>

    <!-- 底部分页控件 -->
    <div class="pagination" style="margin-top: 20px; text-align: center;">
      <el-button
        type="primary"
        plain
        @click="handlePrevPage"
        :disabled="currentPage === 1"
      >
        上一页
      </el-button>
      <span style="margin: 0 10px">
        第 {{ currentPage }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页
        （总计 {{ total }} 条）
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
  </PageContainer>
</template>

<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted } from 'vue'
import { Download, Document } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getTeachingPlansService, exportwenjian } from '@/api/admin.js'
import { ElMessage, ElLoading } from 'element-plus'
// 引入Pinia存储
import { useSubjectStore } from '@/stores/subjectStore'
import { usePlanStore } from '@/stores/planStore'
const subjectStore = useSubjectStore()
const subjectName = subjectStore.currentSubject // 直接获取

const router = useRouter()
const planStore = usePlanStore()

// 状态管理（分页逻辑）
const planList = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取教案列表（带分页）
const getPlanList = async () => {
  isLoading.value = true
  try {
    const resp = await getTeachingPlansService(
      subjectName,
      currentPage.value,
      pageSize.value
    )
    planList.value = resp.data.resources//resource_type,id,title
    total.value = resp.data.total
  } catch (error) {
    ElMessage.error('获取教案列表失败')
    console.error('获取失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 分页控制
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getPlanList()
  }
}

const handleNextPage = () => {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    getPlanList()
  }
}

// 跳转至教案详情页
const goToPlanDetail = (resource_type,id) => {
    planStore.setPlanInfo(resource_type, id)
    router.push(`/admin/plan`)
}

// 返回学科列表页
const goBack = () => {
  router.push('/admin/resourcesManage')
}

// 导出单个教案
const exportSinglePlan = async (resource_type, resource_id) => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在导出教案...',
    background: 'rgba(0, 0, 0, 0.1)'
  })
  
  try {
    // 1. 调用接口，明确设置响应类型为blob
    const response = await exportwenjian(resource_type, resource_id, {
      responseType: 'blob' // 确保获取二进制流
    })
    
    // 2. 从响应头解析文件名（关键：获取后端返回的title相关文件名）
    const contentDisposition = response.headers['content-disposition']
    if (!contentDisposition) {
      throw new Error('未获取到文件名信息')
    }
    
    // 解析并解码文件名（处理UTF-8编码的文件名）
    const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.*)/)
    if (!filenameMatch) {
      throw new Error('文件名格式解析失败')
    }
    const fileName = decodeURIComponent(filenameMatch[1]) // 解码URL编码的文件名
    
    // 3. 处理文件流并创建下载链接
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'text/csv;charset=utf-8;' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName // 使用后端返回的文件名
    
    // 4. 触发下载并清理资源
    document.body.appendChild(link)
    link.click()
    
    // 延迟清理，避免浏览器尚未处理完下载就移除元素
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    ElMessage.success('教案导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error(error.message || '教案导出失败，请重试')
  } finally {
    loading.close()
  }
}

// 初始化加载
onMounted(() => {
  getPlanList()
})
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  align-items: center;
}

// 按钮图标与文字居中
::v-deep .el-button .el-icon {
  margin-right: 5px;
}
</style>