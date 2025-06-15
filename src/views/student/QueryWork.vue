<template>
  <div class="query-work-container">
    <!-- 作业列表区域 -->
    <el-table
      v-loading="isLoading"
      :data="homeworkList"
      style="width: 100%"
      :row-key="row => row.id"
      @expand-change="handleExpandChange"
      class="homework-table"
    >
      <el-table-column
        type="expand"
        width="50"
      >
        <template #default="{ row }">
          <!-- 作业详情展开内容 -->
          <div class="homework-detail">
            <div class="detail-content">
              <h3>作业详情</h3>
              <pre>{{ homeworkDetails[row.id]?.content || '暂无内容' }}</pre>
            </div>
            <div class="answer-section">
              <textarea
                v-model="submitContents[row.id]"
                placeholder="请输入你的答案"
                class="answer-textarea"
                :rows="5"
              ></textarea>
              <el-button
                type="primary"
                :loading="submitLoading[row.id]"
                @click="handleSubmit(row.id)"
                class="submit-btn"
              >
                提交作业
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="作业标题"
        align="center"
      />
    </el-table>
    <!-- 无数据提示 -->
    <div v-if="!isLoading && homeworkList.length === 0" class="no-data-tip">
      暂无作业数据~
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElTable, ElTableColumn, ElButton } from 'element-plus'
import {
  getHomeworkListService,
  getHomeworkDetailService,
  submitHomeworkService
} from '@/api/student' 
import { useUserStore } from '@/stores/user'

// 响应式数据
const homeworkList = ref([]) // 作业列表数据
const isLoading = ref(false) // 加载状态
const expandedRowKeys = ref([]) // 展开的行ID
const homeworkDetails = ref({}) // 作业详情缓存
const submitContents = ref({}) // 学生答案缓存
const submitLoading = ref({}) // 提交按钮加载状态
const userStore = useUserStore()

// 获取作业列表
const getHomeworkList = async () => {
  isLoading.value = true
  try {
    const res = await getHomeworkListService()
    homeworkList.value = res.data.questions || []
  } catch (error) {
    ElMessage.error('获取作业列表失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 处理展开/收起行事件，加载作业详情
const handleExpandChange = async (row, expanded) => {
  if (expanded && row.id && !homeworkDetails.value[row.id]) {
    isLoading.value = true
    try {
      const res = await getHomeworkDetailService(row.id)
      homeworkDetails.value[row.id] = {
        content: res.data.content || ''
      }
    } catch (error) {
      ElMessage.error('获取作业详情失败，请稍后重试')
    } finally {
      isLoading.value = false
    }
  }
}

// 提交作业
const handleSubmit = async (homeworkId) => {
  const answer = submitContents.value[homeworkId]
  if (!answer) {
    ElMessage.warning('请输入答案后再提交')
    return
  }
  submitLoading.value[homeworkId] = true
  try {
    const res = await submitHomeworkService(
      answer,
      userStore.userId,
      homeworkId // 需替换为实际学生ID，比如从store中取homeworkId
    )
    console.log(res)
    if (res.status === 200) { // 假设接口返回code=200表示成功，根据实际接口调整
      ElMessage.success('提交成功')
      submitContents.value[homeworkId] = '' // 清空答案
    } else {
      ElMessage.error(res.msg || '提交失败，请重试')
    }
  } catch (error) {
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    submitLoading.value[homeworkId] = false
  }
}

// 初始化加载作业列表
onMounted(() => {
  getHomeworkList()
})
</script>

<style scoped>
.query-work-container {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 20px;
}

.homework-table {
  --el-table-header-text-color: #666;
  --el-table-row-hover-bg-color: #f8f9fa;
}

.homework-detail {
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 4px;
  margin-top: 10px;
}

.detail-content {
  margin-bottom: 16px;
}

.detail-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.detail-content pre {
  white-space: pre-wrap;
  word-break: break-all;
  color: #555;
  line-height: 1.6;
}

.answer-section {
  margin-top: 16px;
}

.answer-textarea {
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 8px;
  resize: vertical;
  font-size: 14px;
  color: #333;
}

.submit-btn {
  margin-top: 10px;
}

.no-data-tip {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>