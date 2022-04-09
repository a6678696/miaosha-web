<template>
  <div style="width: 40%;margin-left: 30%;margin-top: 6%">
    <p style="text-align: center"><img src="../assets/images/logo.png" height="55"/></p>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户登录</span>
        <router-link type="primary" to="/register">
          <el-button style="float: right; padding: 3px 0" type="text">去注册</el-button>
        </router-link>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="loginUser()">登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import ElementUI from 'element-ui';
import axios from 'axios';
import {getServerUrl} from "@/config/url";
import {hex_md5} from "@/util/md5";

export default {
  name: 'login',
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    loginUser() {
      this.$refs["form"].validate((valid, msg) => {
        if (valid) {
          let token = window.sessionStorage.getItem("token");
          if (token !== null) {
            ElementUI.Message.error("你已经登录过了！！");
            this.$router.replace("/index");
            return false;
          }
          let param = new URLSearchParams();
          param.append("userName", this.form.userName);
          let salt = "2das8fse5hgb";
          param.append("password", hex_md5(salt + this.form.password));
          let url = getServerUrl("user/login","miaosha-user");
          let _this = this;
          axios
            .post(url, param)
            .then(function (response) {
              let token = response.data.token;
              if (response.data.user != null) {
                ElementUI.Message.success("登录成功！！");
                window.sessionStorage.setItem("token", token);
                window.sessionStorage.setItem("name", response.data.user.name);
                window.sessionStorage.setItem("userId", response.data.user.id);
                _this.$router.push("/index");
              } else {
                ElementUI.Message.error("用户名或密码错误！！");
              }
            })
            .catch(function (error) {
              console.log(error);
              ElementUI.Message.error("用户名或密码错误！！");
            })
        } else {
          ElementUI.Message.error("你填写的信息不正确！！");
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
