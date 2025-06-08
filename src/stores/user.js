import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'ems',
  () => {
    const token = ref('') // 定义 token
    const setToken = (t) => (token.value = t) // 设置 token

    const userid = ref('') //定义用户id
    const setUserId = (id) => (userid.value = id) //设置id

    const username = ref('') //定义用户名字
    const setUserName = (username) => (username.value = username) //设置用户名字
    return { token, setToken, userid, setUserId, username, setUserName }
  },
  {
    //开启持久化
    persist: true
  }
)
