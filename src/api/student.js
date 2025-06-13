import request from '@/utils/request'

// 学生信息页面
export const studentGetInfo = (userId) => {
  return request.get('/student/info', {
    params: {
      userId
    }
  })
}

export const studentChangePassword = (userId, password) => {
  request.put('/student/changePassword', {
    userId: userId,
    password: password
  })
}

//学生选课页面
export const getCourseListService = (userId, courseName) => {
  return request.get('/student/getCourseList', {
    params: {
      userId,
      courseName
    }
  })
}

export const selectCourseService = (userId, courseNum, techNum) => {
  return request.post('/student/selectCourse', {
    userId,
    courseNum,
    techNum
  })
}

//已选课程页面
export const getHasSelectCourseListService = (userId, courseName) => {
  return request.get('/student/getHasSelectCourseList', {
    params: {
      userId,
      courseName
    }
  })
}

export const delCourseService = (userId, courseNum, techNum) => {
  return request.delete('/student/delCourse', {
    params: {
      userId,
      courseNum,
      techNum
    }
  })
}

//展示学分数据
export const getHasScoresService = (stuNum) => {
  return request.get('/student/getHasScores', {
    params: {
      stuNum
    }
  })
}

//获取课程表
export const getTimeTableListService = (stuNum) => {
  return request.get('/student/getTimeTableList', {
    params: {
      stuNum
    }
  })
}

// 智能助手获取回答
export const getAIAnswerService = (student_id, question) => {
  request.defaults.timeout = 1000000
  return request.post('/api/student-qa', {
    student_id,
    question
  })
}

export const getAIAnswerServicemore = (student_id, history, new_query) => {
  request.defaults.timeout = 1000000
  return request.post('/api/student-qa/refine', {
    student_id,
    history,
    new_query
  })
}

// 获取作业列表（示例）
export const getHomeworkListService = (studentId) => {
  return request.get(`/api/assessment/list/${studentId}`)
}

// 获取作业详情（示例）
export const getHomeworkDetailService = (id) => {
  return request.get(`/api/assessment/${id}/details`)
}

export const submitHomeworkService = (data) => {
  return request.post('/homework/submit', {
    data
  })
}
