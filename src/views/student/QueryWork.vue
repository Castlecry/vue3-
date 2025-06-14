<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  getHomeworkListService, // 新增作业列表API（需在src/api/student.js中定义）
  getHomeworkDetailService, // 新增作业详情API（需在src/api/student.js中定义）
  submitHomeworkService // 提交作业的API（需在src/api/student.js中定义）
} from '@/api/student'

// 作业列表数据
const homeworkList = ref([])
// 加载状态
const isLoading = ref(false)
// 当前展开的行ID（控制展开状态）
const expandedRowKeys = ref([])
// 作业详情缓存（key为作业ID，value为详情内容）
const homeworkDetails = ref({})

// 获取作业列表
const getHomeworkList = async () => {
  isLoading.value = true
  const resp = await getHomeworkListService(useUserStore().userId) // 假设传学生ID
  homeworkList.value = resp.data || []
  isLoading.value = false
}
getHomeworkList()

// 展开/收起行时触发
const handleExpandChange = async (row, expanded) => {
  if (expanded && !homeworkDetails.value[row.id]) {
    // 展开时调用详情API并缓存
    const detail = await getHomeworkDetailService(row.id)
    homeworkDetails.value = { ...homeworkDetails.value, [row.id]: detail.data }
  }
}

// 存储每个作业的提交内容（key为作业ID）
const submitContents = ref({})
// 提交加载状态（key为作业ID）
const submitLoading = ref({})

// 处理作业提交
const handleSubmit = async (homeworkId) => {
  submitLoading.value[homeworkId] = true
  try {
    const resp = await submitHomeworkService({
      studentId: useUserStore().userId,
      homeworkId,
      content: submitContents.value[homeworkId]
    })
    ElMessage.success(resp.msg || '提交成功')
    // 清空输入框
    submitContents.value[homeworkId] = ''
  } catch (err) {
    ElMessage.error(err.msg || '提交失败，请重试')
  } finally {
    submitLoading.value[homeworkId] = false
  }
}
</script>

<template>
  <PageContainer title="学生作业查询">
    <div class="homework-container">
      <div class="homework-header">
        <h3>作业列表</h3>
        <div class="stats">共 {{ homeworkList.length }} 项作业</div>
      </div>
      <el-table
        v-loading="isLoading"
        :data="homeworkList"
        style="width: 100%"
        :expand-row-keys="expandedRowKeys"
        @expand-change="handleExpandChange"
        class="homework-table"
      >
        <!-- 表格列定义 -->
        <!-- ... 保持原有列定义不变 ... -->
        <!-- 展开行内容 -->
        <template #expand="{ row }">
          <div class="detail-card">
            <!-- 作业详情显示 -->
            <div class="detail-title">作业内容</div>
            <div class="detail-content">
              {{ homeworkDetails.value[row.id]?.content || '加载中...' }}
            </div>
            <!-- 新增提交框 -->
            <div
              class="submit-section"
              v-if="!homeworkDetails.value[row.id]?.isSubmitted"
            >
              <el-input
                v-model="submitContents.value[row.id]"
                type="textarea"
                :rows="3"
                placeholder="请输入作业答案"
                class="submit-input"
              />
              <el-button
                type="primary"
                :loading="submitLoading.value[row.id]"
                @click="handleSubmit(row.id)"
                class="submit-btn"
                style="margin-top: 12px"
              >
                提交作业
              </el-button>
            </div>
            <!-- 已提交提示 -->
            <div class="submitted-tip" v-else>已提交，不可重复提交</div>
          </div>
        </template>
      </el-table>
    </div>
  </PageContainer>
</template>

<style scoped>
/* 卡片容器 */
.homework-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 16px;
}

/* 标题栏 */
.homework-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.homework-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}
.stats {
  font-size: 13px;
  color: #6b7280;
  background: #f9fafb;
  padding: 4px 12px;
  border-radius: 12px;
}

/* 表格样式增强 */
.homework-table {
  border: none !important;
}
.el-table::before {
  height: 0 !important;
}
.el-table__header-wrapper {
  background: #f9fafb;
}
.el-table__header th {
  background: transparent !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

/* 展开行美化 */
.el-table__expanded-cell {
  background: #f9fafb !important;
  border-top: 1px dashed #e5e7eb !important;
}
.detail-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.detail-title {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}
.detail-content {
  color: #4b5563;
  line-height: 1.7;
  font-size: 14px;
  white-space: pre-wrap;
}

/* 状态标签 */
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
.status-assigned {
  background: #eff6ff;
  color: #3b82f6;
}
.status-submitted {
  background: #ecfdf5;
  color: #10b981;
}
.status-overdue {
  background: #fee2e2;
  color: #ef4444;
}

/* 动画效果 */
.el-table__row {
  transition: all 0.2s ease;
}
.el-table__expanded-cell {
  transition: background-color 0.3s ease;
}
.el-button.text {
  transition: all 0.2s ease;
}
</style>

<style scoped>
/* 表格整体样式 */
.el-table {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
}

/* 表头样式 */
.el-table__header th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 500;
}

/* 表格行悬停效果 */
.el-table__body tr:hover > td {
  background: #f5f7fa !important;
}

/* 展开行内容样式 */
.el-table__expanded-cell {
  padding: 20px 32px;
  background: #fafbfc;
}
.el-table__expanded-cell p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 展开按钮样式 */
.el-button.text {
  color: #409eff;
  font-size: 13px;
  transition: color 0.2s;
}
.el-button.text:hover {
  color: #2a78d6;
}
.el-button.text::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"%3E%3Cpath d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="%23409eff"/%3E%3C/svg%3E') no-repeat center;
  vertical-align: middle;
}
.el-button.text[aria-expanded='true']::before {
  transform: rotate(180deg);
}

/* 提交区域样式 */
.submit-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e5e7eb;
}
.submit-input {
  --el-input-border-radius: 6px;
}
.submit-btn {
  --el-button-padding: 6px 20px;
}
.submitted-tip {
  color: #10b981;
  font-size: 14px;
  padding: 12px;
  background: #ecfdf5;
  border-radius: 4px;
  margin-top: 12px;
}
</style>
