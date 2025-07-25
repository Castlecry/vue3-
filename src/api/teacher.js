import request from '@/utils/request'

//教师个人信息页面
export const getInfoService = (userId) => {
  return request.get('/teacher/info', {
    params: {
      userId
    }
  })
}

export const teacherChangePasswordService = (userId, password) => {
  request.put('/teacher/changePassword', {
    userId: userId,
    password: password
  })
}

//教师管理课程页面
export const getOpenListService = (userId, courseName) => {
  return request.get('/teacher/getOpenList', {
    params: {
      userId,
      courseName
    }
  })
}

export const openCourseService = (userId, FormData) => {
  return request.post('/teacher/openCourse', {
    techNum: userId,
    ...FormData
  })
}

export const editCourseService = (FormData) => {
  return request.put('/teacher/editCourse', {
    ...FormData
  })
}

export const delCourseService = (techNum, courseNum, adminNum) => {
  return request.delete('/teacher/deleteCourse', {
    params: {
      techNum,
      courseNum,
      adminNum
    }
  })
}

//打分页面
export const getMarkListService = (techNum, courseName) => {
  return request.get('/teacher/getMarkList', {
    params: {
      techNum,
      courseName
    }
  })
}

export const markOperateService = (cst) => {
  return request.put('/teacher/markOperate', cst)
}

//请假管理页面
export const getLeaveListService = (userId) => {
  return request.get('/teacher/getLeaveList', {
    params: {
      techNum: userId
    }
  })
}

export const allowApplyLeaveService = (cst) => {
  return request.post('/teacher/allowApplyLeave', cst)
}

export const rejectApplyLeaveService = (cst) => {
  return request.delete('/teacher/rejectApplyLeave', {
    params: {
      courseNum: cst.courseNum,
      techNum: cst.techNum,
      stuNum: cst.stuNum
    }
  })
}

// 智能助手获取回答
export const getAIAnswerService = (teacher_id, query) => {
  request.defaults.timeout = 1000000
  return request.post('/api/teaching-plans', {
    teacher_id,
    query
  })
}

export const getAIAnswerServicemore = (
  teacher_id,
  history,
  new_query,
  base_teaching_plan_id
) => {
  request.defaults.timeout = 1000000
  return request.post('/api/teaching-plans/refine', {
    teacher_id,
    history,
    new_query,
    base_teaching_plan_id
  })
}
// 智能助手获取回答考核生成
export const getAIAnswerService1 = (teacher_id, query) => {
  request.defaults.timeout = 1000000
  return request.post('/api/assessments/generate', {
    teacher_id,
    query
  })
}

export const getAIAnswerService1more = (
  teacher_id,
  history,
  new_query,
  base_assessment_id
) => {
  request.defaults.timeout = 1000000
  return request.post('/api/assessments/refine', {
    teacher_id,
    history,
    new_query,
    base_assessment_id
  })
}
//学情评估展示，在teacher的CourseManage页面
export const getStudentcondition = (assessment_id) => {
  return request.get(`api/assessments/${assessment_id}/student-performance/12`)
}

// 获取题库列表
export const getQuestionBanks = (teacher_id) => {
  return request.get(`api/teacher/assessments/${teacher_id}`)
}

// 发布题库
export const publishQuestionBank = (assessment_id,teacher_id) => {
  return request.post('api/teacher/assessments/publish', {
    assessment_id: assessment_id,
    teacher_id:teacher_id
  })
}

// 获取老师发布的试题列表（页面加载时调用）
export const getTeacherExamsService = (teacher_id) => {
  return request.get(`/api/teacher/${teacher_id}/published-assessments`);
};

// 获取试题学情详情（点击按钮时调用）
export const getExamAnalysisService = (assessment_id) => {
  request.defaults.timeout = 1000000
  return request.get(`/api/assessments/${assessment_id}/analysis`);
};