<template>
  <PageContainer :title="`${subjectName} - 教案详情`">
    <template #extra>
      <div class="header">
        <!-- 占位导出按钮（暂不实现功能） -->
        <el-button
          type="primary"
          :icon="Download"
          disabled
          tooltip="功能开发中"
        >
          导出教案
        </el-button>
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
          
          <!-- 导出按钮：占位（暂不实现功能） -->
          <el-button
            type="success"
            :icon="Download"
            circle
            plain
            style="margin-left: 8px"
            disabled
            tooltip="导出功能开发中"
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
import { Download, Document } from '@element-plus/icons-vue' // 修改为Document图标
import { useRoute, useRouter } from 'vue-router'
import { getTeachingPlansService } from '@/api/admin.js'
import { ElMessage } from 'element-plus'
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
      subjectName
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