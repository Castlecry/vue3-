<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAIAnswerService, getAIAnswerServicemore } from '@/api/student.js'
import { ElMessage } from 'element-plus'

// 获取当前时间（HH:MM格式）
const getCurrentTime = () => {
  const time = new Date().toTimeString().slice(0, 5)
  return time
}

// 消息列表
const messages = ref([
  {
    type: 'ai',
    content: '你好！我是你的智能助手，有什么可以帮你解答的？',
    time: ''
  }
])

// 输入框内容
const inputText = ref('')

// 消息容器引用
const chatContainer = ref(null)

// 组件挂载时设置初始消息时间并滚动到底部
onMounted(() => {
  messages.value[0].time = getCurrentTime()
  scrollToBottom()
})

// 发送消息
const sendMessage = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }

  const userQuestion = inputText.value.trim()

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userQuestion,
    time: getCurrentTime()
  })

  try {
    const userStore = useUserStore()
    let response

    // 判断是否首次提问
    if (qaHistory.value.length === 0) {
      response = await getAIAnswerService(userStore.userId, userQuestion)
    } else {
      response = await getAIAnswerServicemore(userStore.userId, qaHistory.value)
    }

    const aiAnswer = response.data

    // 添加AI回复
    messages.value.push({
      type: 'ai',
      content: '正在回答:' + aiAnswer,
      time: getCurrentTime()
    })

    // 维护历史问答
    qaHistory.value.push({
      question: userQuestion,
      answer: aiAnswer
    })
  } catch (error) {
    console.error('获取回答失败', error)
    ElMessage.error('获取回答失败，请重试')
  } finally {
    inputText.value = ''

    // 无论用户当前位置如何，都强制滚动到底部
    await nextTick()
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 存储历史问答对
const qaHistory = ref([])
</script>

<template>
  <PageContainer title="智能学习助手小C">
    <!-- 消息显示区域 -->
    <div ref="chatContainer" class="chat-container">
      <div class="messages" v-for="(msg, index) in messages" :key="index">
        <!-- AI回复消息 -->
        <div v-if="msg.type === 'ai'" class="message ai-message">
          <div class="avatar">
            <img
              src="@/assets/ai.png"
              alt="AI头像"
              style="width: 100%; height: 100%; border-radius: 50%"
            />
          </div>
          <div class="content">
            <div class="text">{{ msg.content }}</div>
            <div class="time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="message user-message">
          <div class="content">
            <div class="text">{{ msg.content }}</div>
            <div class="time">{{ msg.time }}</div>
          </div>
          <div class="avatar">👤</div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <el-input
        v-model="inputText"
        placeholder="输入消息并回车发送"
        @keyup.enter="sendMessage"
        class="input"
      ></el-input>
      <el-button type="primary" @click="sendMessage" class="send-btn"
        >发送</el-button
      >
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.chat-container {
  height: calc(70vh - 180px);
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}
.messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
  margin-left: auto;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

.ai-message .avatar {
  background: #e6f4ff;
  color: #1677ff;
}

.user-message .avatar {
  background: #f0f9eb;
  color: #52c41a;
}

.content {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-grow: 1;
}

.user-message .content {
  background: #e6f4ff;
}

.text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.time {
  font-size: 12px;
  color: #909399;
  text-align: right;
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: white;
  border-top: 1px solid #ebedf0;
}

.input {
  flex-grow: 1;
  height: 40px; /* 增加输入框高度 */
  .el-input__inner {
    border-radius: 20px; /* 输入框圆角 */
    padding: 0 20px; /* 调整内边距 */
    font-size: 14px;
  }
}

.send-btn {
  white-space: nowrap;
  height: 40px; /* 与输入框高度一致 */
  padding: 0 24px; /* 增加按钮内边距 */
  border-radius: 20px; /* 按钮圆角 */
  background: #1677ff; /* 主色背景 */
  border: none;
  &:hover {
    background: #4096ff; /* 悬停颜色 */
  }
}
</style>
