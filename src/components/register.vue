<template>
  <div style="width: 40%;margin-left: 30%;">
    <p style="text-align: center"><img src="../assets/images/logo.png" height="55"/></p>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户注册</span>
        <router-link type="primary" to="/">
          <el-button style="float: right; padding: 3px 0" type="text">去登录</el-button>
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
          <el-form-item label="确认密码" prop="password2">
            <el-input v-model="form.password2" type="password"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="registerUser()">注册</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import ElementUI from "element-ui";
import {getServerUrl} from "@/config/url";
import {hex_md5} from "@/util/md5";

export default {
  name: 'register',
  data() {
    //检验用户名是否已经存在于数据库中
    let checkUserName = (rule, value, callback) => {
      let param = new URLSearchParams();
      param.append("userName", value);
      let url = getServerUrl("user/checkUserName","miaosha-user");
      axios
        .post(url, param)
        .then(function (response) {
          if (response.data) {
            callback();
          } else {
            callback(new Error('用户名已经存在,请重新输入!'));
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    //检验手机号是否已经存在于数据库中
    let checkPhone = (rule, value, callback) => {
      let param = new URLSearchParams();
      param.append("phone", value);
      let url = getServerUrl("user/checkPhone","miaosha-user");
      axios
        .post(url, param)
        .then(function (response) {
          if (response.data) {
            callback();
          } else {
            callback(new Error('手机号已经被注册,请重新输入!'));
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    //检验密码和确认密码是否一样
    let checkPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('密码和确认密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        userName: '',
        password: '',
        password2: '',
        phone: '',
        name: '',
        address: ''
      },
      rules: {
        userName: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {validator: checkUserName, trigger: 'blur'}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"}
        ],
        password2: [
          {required: true, message: "请输入确认密码", trigger: "blur"},
          {validator: checkPassword, trigger: 'blur'}
        ],
        phone: [
          {required: true, message: "请输入手机号", trigger: "blur"},
          {validator: checkPhone, trigger: 'blur'}
        ],
        name: [
          {required: true, message: "请输入姓名", trigger: "blur"}
        ],
        address: [
          {required: true, message: "请输入地址", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    registerUser() {
      this.$refs["form"].validate((valid, msg) => {
        if (valid) {
          let param = new URLSearchParams();
          param.append("userName", this.form.userName);
          let salt = "2das8fse5hgb";
          param.append("password", hex_md5(salt + this.form.password));
          param.append("phone", this.form.phone);
          param.append("address", this.form.address);
          param.append("name", this.form.name);
          let _this = this;
          let url = getServerUrl("user/register","miaosha-user");
          axios
            .post(url, param)
            .then(function (response) {
              let registerSuccess = response.data;
              if (registerSuccess) {
                ElementUI.Message.success("注册成功！！");
                _this.$router.push("/");
              }
            })
            .catch(function (error) {
              console.log(error);
              ElementUI.Message.error("注册失败！！");
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
