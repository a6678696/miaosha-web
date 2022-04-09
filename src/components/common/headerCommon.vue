<template>
  <div>
    <img src="~@/assets/images/logo.png" height="55" alt="">
    <el-tag type="primary" style="float: right;margin-top: 20px">欢迎你，{{ userName }}</el-tag>
  </div>
</template>

<script>
import axios from "axios";
import {getServerUrl} from "@/config/url";

export default {
  name: "headerCommon",
  data() {
    return {
      userName: window.sessionStorage.getItem("name")
    }
  },
  methods: {
    refreshToken() {
      let token = window.sessionStorage.getItem("token");
      if (token == null) {
        this.$router.push("/");
        this.$router.go(0);
      }
      let url = getServerUrl("user/token/refreshToken","miaosha-user");
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios.get(url)
        .then(response => {
          if (response.data) {
            console.log("token刷新成功!");
          } else {
            console.log("token刷新失败!");
          }
        })
        .catch(error => {
          alert(error);
        })
    }
  },
  mounted() {
    //5分钟刷新一次Redis中的token
    setInterval(this.refreshToken, 1000 * 60 * 5);
  }
}
</script>

<style scoped>

</style>
