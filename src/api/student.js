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


export const getHomeworkListService = () => {
  return request.get(`/api/assessments/list`)
}


export const getHomeworkDetailService = (assessment_id) => {
  return request.get(`/api/assessments/${assessment_id}/details`)
}

export const submitHomeworkService = (query,student_id,assessment_id) => {
  request.defaults.timeout = 1000000
  return request.post('api/assessments/evaluate-answers', {
    query,
    student_id,
    assessment_id
  })
}

export const getStudentExercise = (student_id,query) => {
  request.defaults.timeout = 1000000
  return request.post('/api/practice-questions/generate', {
    student_id,
    query// 根据实际接口需求调整参数
  })
}

// 新增：提交学生练习答案的方法（假设接口路径为/api/student-exercise/submit）
export const submitStudentExercise = (student_id, exercise_id, answer) => {
  request.defaults.timeout = 1000000
  return request.post('/api/practice-assistant/chat', {
    student_id,
    exercise_id,
    answer // 根据实际接口需求调整参数
  })
}

export const getAIAnswerService1 = (student_id, query) => {
  request.defaults.timeout = 1000000
  return request.post('/api/practice-questions/generate', {
    student_id,
    query
  })
}

export const getAIAnswerService1more = (
  student_id,
  history,
  new_query,
  active_catalog_id
) => {
  request.defaults.timeout = 1000000
  return request.post('/api/practice-assistant/chat', {
    student_id,
    history,
    new_query,
    active_catalog_id
  })
}