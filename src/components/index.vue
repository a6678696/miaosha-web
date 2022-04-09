<template>
  <div>
    <el-header>
      <my-header></my-header>
    </el-header>
    <el-row>
      <el-col :md="8">
        <div class="grid-content bg-purple">
          <el-aside width="422px">
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              :show-close="false"
              :before-close="handleClose">
              <span>是否要注销？</span>
              <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="logout()">是</el-button>
              <el-button type="danger" @click="dialogVisible = false">否</el-button>
            </span>
            </el-dialog>
            <el-row class="tac">
              <el-col :span="12">
                <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose">
                  <el-menu-item index="1" @click="currentCom='listAllNow'">
                    <i class="el-icon-sell"></i>
                    <span slot="title">正在秒杀</span>
                  </el-menu-item>
                  <el-menu-item index="2" @click="currentCom='listMyOrder'">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">我的订单</span>
                  </el-menu-item>
                  <el-menu-item index="3" @click="dialogVisible = true">
                    <i class="el-icon-switch-button"></i>
                    <span slot="title">注销</span>
                  </el-menu-item>
                </el-menu>
              </el-col>
            </el-row>
          </el-aside>
        </div>
      </el-col>
      <el-col :md="16">
        <div class="grid-content bg-purple-light">
          <component :is="currentCom"></component>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import headerCommon from "./common/headerCommon";
import listAllNow from "./listAllNow";
import listMyOrder from "./listMyOrder";
import miaoShaPage from "./miaoShaPage";
import axios from "axios";
import ElementUI from "element-ui";
import {getServerUrl} from "@/config/url";

export default {
  name: "index",
  data() {
    return {
      currentCom: 'listAllNow',
      dialogVisible: false
    }
  },
  components: {
    "my-header": headerCommon,
    listAllNow,
    miaoShaPage,
    listMyOrder
  },
  methods: {
    //注销登录
    logout() {
      let url = getServerUrl("user/logout","miaosha-user");
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      let _this = this;
      axios.get(url)
        .then(response => {
          console.log(response.data);
          if (response.data) {
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("name");
            window.sessionStorage.removeItem("userId");
            _this.$router.push("/");
            ElementUI.Message.error("你已退出登录!!");
          }
        }).catch(error => {
        alert(error);
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
.el-aside::-webkit-scrollbar {
  display: none;
}
</style>
