<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { getHasSelectCourseListService, delCourseService } from '@/api/student'
import { formatTime } from '@/utils/format'

const teachername = ref('')
const courseList = ref([])
const isLoading = ref(false)

//查询课程，赋值到表格里
const userstore = useUserStore()
const getHasSelectCourseList = async (userId, courseName) => {
  isLoading.value = true
  // console.log(userId)

  const resp = await getHasSelectCourseListService(userId, courseName)
  // console.log(resp)
  courseList.value = resp.data

  isLoading.value = false
}

getHasSelectCourseList(userstore.userId)

// 处理退课
const deleteCourse = async (row) => {
  ElMessageBox.confirm('确认退选这门课吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      //1.发送退课请求  参数带上学生学号 + 课程号
      await delCourseService(userstore.userId, row.courseNum, row.techNum)
      //2.如果能拿到数据，返回选课成功
      ElMessage({
        type: 'success',
        message: '退课成功'
      })
      //3.再次发送请求获取数据
      getHasSelectCourseList(userstore.userId)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '退课取消'
      })
    })
}

//查询已选课程
const selectHasCourseByCourseName = (courseName) => {
  getHasSelectCourseList(userstore.userId, courseName)
}
</script>

<template>
  <PageContainer title="我的作业">
    <template #extra>
      <div class="header">
        <el-input placeholder="请输入老师名" v-model="teachername"></el-input>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="selectHasCourseByCourseName(teachername)"
          >查询</el-button
        >
      </div>
    </template>

    <!-- 查询课程表格 -->
    <el-table v-loading="isLoading" :data="courseList" style="width: 100%">
      <el-table-column
        prop="courseNum"
        label="课程号"
        width="100"
      ></el-table-column>
      <el-table-column prop="courseName" label="课程名"></el-table-column>
      <el-table-column prop="techName" label="主讲教师"></el-table-column>
      <el-table-column prop="startTime" label="开课时间" width="100">
        <template #default="{ row }">
          {{ formatTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结课时间" width="100">
        <template #default="{ row }">
          {{ formatTime(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="学分"></el-table-column>
      <el-table-column prop="selPeople" label="已选人数"></el-table-column>
      <el-table-column prop="maxPeople" label="最大人数"></el-table-column>
      <el-table-column prop="place" label="地点"></el-table-column>
      <el-table-column prop="selWeek" label="上课星期"></el-table-column>
      <el-table-column prop="selStart" label="第一节课">
        <template #default="{ row }"> 第{{ row.selStart }}节 </template>
      </el-table-column>
      <el-table-column prop="selEnd" label="最后一节">
        <template #default="{ row }"> 第{{ row.selEnd }}节 </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            type="primary"
            @click="deleteCourse(scope.row)"
            v-if="scope.row.mark == -1"
            >退课</el-button
          >
          <el-text type="primary" v-else>得分:{{ scope.row.mark }}</el-text>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </PageContainer>
</template>

<style scoped lang="scss">
.header {
  display: flex;
}
</style>
