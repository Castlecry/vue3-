<template>
  <div class="assessment-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">学情评估</h1>
      <p class="page-desc">查看您发布的试题及学生答题情况分析</p>
    </div>
    
    <!-- 试题列表区域 -->
    <div class="exam-list-container">
      <div v-loading="isLoading" class="exam-list">
        <div 
          v-for="exam in examList" 
          :key="exam.id" 
          class="exam-card"
          @click.stop="toggleExamDetail(exam.id)"
        >
          <div class="exam-header">
            <h3 class="exam-title">{{ exam.title }}</h3>
            <el-button 
              type="primary" 
              size="small"
              :loading="analysisLoading[exam.id]"
              @click="getExamAnalysis(exam.id)"
            >
              展示学情
            </el-button>
          </div>
          
          <!-- 学情分析内容 (展开/收起) -->
          <div 
            class="analysis-content"
            :class="{ 'expanded': expandedExamIds.includes(exam.id) }"
          >
            <div v-if="analysisLoading[exam.id]" class="loading-skeleton">
              <el-skeleton animated :rows="5" />
            </div>
            
            <div v-else-if="examAnalysis[exam.id] && examAnalysis[exam.id].length > 0" class="analysis-data">
              <h4 class="analysis-title">学生答题情况</h4>
              <div v-for="(student, index) in examAnalysis[exam.id]" :key="index" class="student-item">
                <div class="student-info">
                  <span class="student-name">{{ student.studentName }}</span>
                  <span class="correct-rate">正确率: {{ student.correctRate }}%</span>
                </div>
                <div class="question-summary">
                  <span>正确题数: {{ student.correctCount }}/{{ student.totalCount }}</span>
                </div>
              </div>
            </div>
            
            <div v-else-if="!analysisLoading[exam.id]" class="no-analysis-data">
              暂无学生答题数据
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无数据提示 -->
      <div v-if="!isLoading && examList.length === 0" class="no-data-tip">
        <el-empty description="您还没有发布试题" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElEmpty, ElSkeleton } from 'element-plus'
import { getTeacherExamsService, getExamAnalysisService } from '@/api/teacher'
import { useUserStore } from '@/stores/user'

// 响应式数据
const examList = ref([]) // 试题列表
const examAnalysis = ref({}) // 试题分析数据
const isLoading = ref(true) // 全局加载状态
const expandedExamIds = ref([]) // 展开的试题ID
const analysisLoading = ref({}) // 学情分析加载状态

// 获取老师发布的试题列表
const fetchTeacherExams = async () => {
  isLoading.value = true
  try {
    const userStore = useUserStore()
    const res = await getTeacherExamsService({ teacherId: userStore.userId })
    examList.value = res.data.exams || []
  } catch (error) {
    ElMessage.error('获取试题列表失败，请稍后重试')
    console.error('获取试题列表失败', error)
  } finally {
    isLoading.value = false
  }
}

// 获取试题学情分析
const getExamAnalysis = async (examId) => {
  if (analysisLoading.value[examId]) return // 防止重复请求
  
  analysisLoading.value[examId] = true
  try {
    const res = await getExamAnalysisService({ examId })
    examAnalysis.value[examId] = res.data.students || []
    
    // 自动展开查看学情
    if (!expandedExamIds.value.includes(examId)) {
      expandedExamIds.value.push(examId)
    }
  } catch (error) {
    ElMessage.error('获取学情分析失败，请稍后重试')
    console.error('获取学情分析失败', error)
  } finally {
    analysisLoading.value[examId] = false
  }
}

// 切换试题详情展开状态
const toggleExamDetail = (examId) => {
  if (expandedExamIds.value.includes(examId)) {
    expandedExamIds.value = expandedExamIds.value.filter(id => id !== examId)
  } else {
    expandedExamIds.value.push(examId)
  }
}

// 初始化加载试题列表
onMounted(() => {
  fetchTeacherExams()
})
</script>

<style scoped>
.assessment-page {
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  color: #1f2d3d;
  margin-bottom: 10px;
  font-weight: 600;
}

.page-desc {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.exam-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.exam-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.exam-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exam-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.exam-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam-title {
  font-size: 18px;
  color: #1f2d3d;
  font-weight: 600;
  margin: 0;
}

.analysis-content {
  padding: 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.3s ease;
  background-color: #f9fafc;
}

.analysis-content.expanded {
  max-height: 500px;
  padding: 20px;
}

.analysis-title {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.student-item {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.student-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.student-name {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.correct-rate {
  font-size: 14px;
  color: #00b42a;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.question-summary {
  font-size: 14px;
  color: #606266;
}

.no-analysis-data {
  font-size: 14px;
  color: #909399;
  padding: 15px 0;
  text-align: center;
}

.no-data-tip {
  text-align: center;
  padding: 40px 0;
}

.loading-skeleton {
  padding: 15px 0;
}
</style>