<template>
  <PageContainer title="学生学习效果分析">
    <template #extra>
      <el-button 
        type="primary" 
        @click="handleRefresh"
        :loading="isLoading"
      >
        <Refresh :size="16" style="margin-right: 5px;" />
        刷新数据
      </el-button>
    </template>

    <div class="stats-container">
      <!-- 图表容器 -->
      <el-card class="stat-card">
        <div class="card-header">
          <h3>学习效果趋势与薄弱知识点</h3>
          <p class="card-desc">学生答题准确率变化及掌握薄弱的知识点分析</p>
        </div>
        
        <div class="charts-wrapper">
          <!-- 左侧：准确率趋势折线图 -->
          <div class="chart-item">
            <h4 class="chart-title">准确率趋势</h4>
            <div v-if="loadingTrend" class="loading-data">
              <el-skeleton />
            </div>
            <div v-else-if="accuracyTrend.length === 0" class="empty-data">
              暂无准确率趋势数据
            </div>
            <div v-else class="chart-container">
              <LineChart 
                :data="lineChartData" 
                :options="lineChartOptions"
              />
            </div>
          </div>

          <!-- 右侧：薄弱知识点雷达图 -->
          <div class="chart-item">
            <h4 class="chart-title">薄弱知识点掌握度</h4>
            <div v-if="loadingConcepts" class="loading-data">
              <el-skeleton />
            </div>
            <div v-else-if="weakestConcepts.length === 0" class="empty-data">
              暂无薄弱知识点数据
            </div>
            <div v-else class="chart-container">
              <RadarChart 
                :data="radarChartData" 
                :options="radarChartOptions"
              />
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细数据表格 -->
      <el-card class="stat-card">
        <div class="card-header">
          <h3>薄弱知识点详情</h3>
          <p class="card-desc">各知识点的掌握率及答题情况</p>
        </div>
        <div v-if="loadingConcepts" class="loading-data">
          <el-skeleton row="5" />
        </div>
        <el-table 
          v-else
          :data="weakestConcepts" 
          border 
          style="width: 100%; margin-top: 16px"
          :header-cell-style="{ backgroundColor: '#f5f7fa' }"
        >
          <el-table-column prop="concept" label="知识点" align="center" />
          <el-table-column 
            prop="mastery_rate" 
            label="掌握率" 
            align="center"
            :formatter="(row) => `${row.mastery_rate}%`"
          />
          <el-table-column prop="total_attempts" label="总答题数" align="center" />
          <el-table-column prop="incorrect_attempts" label="错误次数" align="center" />
        </el-table>
      </el-card>
    </div>
  </PageContainer>
</template>

<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted, computed, nextTick } from 'vue'
import { Line, Radar } from 'vue-chartjs' // 引入图表组件
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadarController,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js'
import { getLearningEffectService } from '@/api/admin.js'
import { ElMessage, ElTable, ElTableColumn, ElSkeleton } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

// 注册所有必要组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadarController,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
)

// 注册图表组件
const LineChart = Line
const RadarChart = Radar

// 数据状态
const accuracyTrend = ref([])
const weakestConcepts = ref([])
const isLoading = ref(false)
const loadingTrend = ref(true)
const loadingConcepts = ref(true)

// 折线图数据
const lineChartData = computed(() => ({
  labels: accuracyTrend.value.map(item => item.date),
  datasets: [
    {
      label: '平均准确率（%）',
      data: accuracyTrend.value.map(item => item.average_accuracy),
      borderColor: '#4096ff',
      backgroundColor: 'rgba(64, 150, 255, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4096ff',
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
}))

// 雷达图数据
const radarChartData = computed(() => ({
  labels: weakestConcepts.value.map(item => item.concept),
  datasets: [
    {
      label: '掌握率（%）',
      data: weakestConcepts.value.map(item => item.mastery_rate),
      backgroundColor: 'rgba(237, 100, 166, 0.2)',
      borderColor: '#ed64a6',
      pointBackgroundColor: '#ed64a6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ed64a6'
    }
  ]
}))

// 折线图配置
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#eee',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: (context) => `准确率: ${context.raw}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

// 雷达图配置
const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#eee',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: (context) => `掌握率: ${context.raw}%`
      }
    }
  },
  scales: {
    r: {
      angleLines: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: {
        display: false
      }
    }
  }
}

// 获取数据
const getLearningData = async () => {
  isLoading.value = true
  loadingTrend.value = true
  loadingConcepts.value = true
  
  try {
    const resp = await getLearningEffectService()
    
    // 设置数据（延迟处理，模拟网络延迟）
    setTimeout(() => {
      accuracyTrend.value = resp.data.accuracy_trend || []
      weakestConcepts.value = resp.data.weakest_concepts || []
      
      // 确保DOM更新后再标记为加载完成
      nextTick(() => {
        loadingTrend.value = false
        loadingConcepts.value = false
      })
    }, 300) // 模拟300ms延迟
    
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 刷新方法
const handleRefresh = () => getLearningData()

// 初始化
onMounted(() => getLearningData())
</script>

<style scoped lang="scss">
.stats-container {
  padding: 20px;
  gap: 20px;
  display: grid;
}

.stat-card {
  overflow: hidden;
  border-radius: 10px;
}

.card-header {
  padding: 18px 24px;
  border-bottom: 1px solid #f5f7fa;
}

.charts-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 24px;
}

.chart-item {
  position: relative;
  height: 400px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.loading-data, .empty-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

.empty-data {
  color: #86909c;
}

:deep(.el-skeleton) {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@media (max-width: 1200px) {
  .charts-wrapper {
    grid-template-columns: 1fr;
  }
  .chart-item {
    height: 300px;
  }
}

:deep(.el-table) {
  margin: 20px;
}
</style>