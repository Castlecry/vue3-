<script setup>
import { ref } from 'vue'
import {
  addStudentService,
  editStudentService,
  getStudentListService
} from '@/api/admin.js'
const dialogFormVisible = ref(false)
// 表单数据
const formData = ref({
  password: '',
  name: ''
})

//记录新增/修改状态，0为新增
const status = ref(0)

//学生学号集合，用于判断是否有重复学号
const stuNumList = ref([])
const getStuNumList = async () => {
  const resp = await getStudentListService()
  const studentList = resp.data
  // console.log(studentList)
  stuNumList.value = studentList.map((student) => student.stuNum)
}
getStuNumList()

// 定义打开函数
const open = (row) => {
  //如果row有值表示修改，否则表示新增
  if (row) {
    formData.value = { ...row }
    status.value = 1
  } else {
    //新增的时候清空表单数据
    formData.value = {}
    status.value = 0
  }
  dialogFormVisible.value = true
}

defineExpose({ open })

// 表单校验规则
const form = ref(null)

const rules = {
  stuNum: [
    {
      required: true,
      message: '学生学号不能为空',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (
          stuNumList.value.includes(formData.value.stuNum) &&
          status.value == 0
        ) {
          callback(new Error('学生学号不应该重复'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: {
    required: true,
    message: '密码不能为空',
    trigger: 'blur'
  },
  name: {
    required: true,
    message: '名字不能为空',
    trigger: 'blur'
  }
}
//定义成功通知事件
const emit = defineEmits(['success'])

// 2.添加 / 修改数据
const submitData = async () => {
  //1.先进行校验
  await form.value.validate()
  //2.根据stuNum来判断是新增还是修改
  try {
    if (status.value == 1) {
      //修改
      await editStudentService(formData.value)
      ElMessage.success('修改学生信息成功')
    } else {
      //新增
      await addStudentService(formData.value)
      ElMessage.success('新增学生信息成功')
    }
  } catch (err) {
    return new Error(err)
  } finally {
    //通知父组件，刷新数据
    emit('success')
    dialogFormVisible.value = false
  }
}
</script>

<template>
  <!-- 消息对话框  新增/修改功能 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="status == 1 ? '修改学生信息' : '新增学生信息'"
  >
    <el-form
      ref="form"
      :rules="rules"
      :model="formData"
      :inline="true"
      class="form-inline"
    >
      <!-- 选择审核人 -->
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名"></el-input
      ></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitData"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-inline .el-input {
  --el-input-width: 220px;
}
</style>
