<template>
  <div style="margin-left: -21%">
    <el-dialog
      :title="canKill?'正在秒杀':'秒杀已结束'"
      :visible.sync="dialogVisible"
      width="30%" :before-close="closeDialog"
      fullscreen="fullscreen">
      <div>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <img :src="miaoShaGoods.goods.image" alt="" style="width: 311px">
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <h2 style="color: darkblue" v-if="canKill">还有 <span style="color: red">{{ hour }}</span> 时 <span
                style="color: red">{{ minute }}</span> 分 <span style="color: red">{{ second }}</span> 秒 <span
                style="color: red">结束</span>本场秒杀</h2>
              <h2 style="color: red" v-if="!canKill">本场秒杀已结束</h2>
              <h3>名称：<span style="color: blueviolet">{{ miaoShaGoods.goods.name }}</span></h3>
              <h3>原价：<span style="color: blue">{{ miaoShaGoods.goods.price }}</span> 元</h3>
              <h3>秒杀价：<span style="color: green">{{ miaoShaGoods.price }}</span> 元</h3>
              <h3>优惠：<span style="color: cornflowerblue">{{ miaoShaGoods.goods.price - miaoShaGoods.price }}</span> 元
              </h3>
              <h3>数量：<span style="color: orange">{{ miaoShaGoods.stock }}</span></h3>
              <h3>秒杀时间：{{ miaoShaGoods.startTime }} ~ {{ miaoShaGoods.endTime }}</h3>
              <h3 v-if="statusMiaoSha===0">当前状态: <span style="color:green;">正在秒杀</span></h3>
              <h3 v-if="statusMiaoSha===1">当前状态: <span style="color:#9a9a3d;">排队中...</span></h3>
              <h3 v-if="statusMiaoSha===2">当前状态: <span style="color:green;">恭喜，你已经抢到商品</span></h3>
              <h3 v-if="statusMiaoSha===3">当前状态: <span style="color:red;">你手慢了，没有抢到商品</span></h3>
              <el-button type="primary" round @click="killGoods()" v-if="canKill">抢购</el-button>
              <el-button type="danger" disabled round @click="killGoods()" v-if="!canKill">无法抢购</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeDialog()">关闭</el-button>
  </span>
    </el-dialog>
    <el-table
      :data="listAllNow"
      style="width: 100%">
      <el-table-column
        label="图片"
        prop="goods.image" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.goods.image" alt="" style="width: 144px;height: 144px">
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        prop="goods.name" align="center">
      </el-table-column>
      <el-table-column
        label="原价"
        prop="goods.price" align="center">
      </el-table-column>
      <el-table-column
        label="秒杀价"
        prop="price" align="center">
      </el-table-column>
      <el-table-column
        label="开始时间"
        prop="startTime" sortable align="center">
      </el-table-column>
      <el-table-column
        label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini" type="primary"
            @click="openMiaoShaDialog(scope.row.id)">去秒杀
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import {getServerUrl} from "@/config/url";
import ElementUI from "element-ui";

export default {
  name: "listAllNow",
  data() {
    return {
      listAllNow: null,
      miaoShaGoods: {
        id: 0,
        goodsId: 0,
        price: 0,
        stock: 0,
        startTime: '',
        endTime: '',
        canKill: '',
        goods: {
          id: 0,
          name: '',
          price: 0,
          image: '',
          stock: 0,
          detail: ''
        }
      },
      dialogVisible: false,
      statusMiaoSha: 0,
      waitTime: 10000,
      time: 0,
      canKill: true,
      hour: 0,
      minute: 0,
      second: 0
    }
  },
  methods: {
    openMiaoShaDialog: function (id) {
      this.canKill = true;
      this.waitTime = 10000;
      let _this = this;
      let url = getServerUrl("miaoShaGoods/findById?id=" + id,"miaosha-goods");
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios
        .get(url)
        .then(function (response) {
          _this.miaoShaGoods = response.data;
          _this.time = Math.round((new Date(_this.miaoShaGoods.endTime).getTime() - new Date().getTime()) / 1000);
          if (_this.miaoShaGoods.stock <= 0) {
            _this.canKill = false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.dialogVisible = true;
    },
    timeReduce() {
      if (this.time > 0) {
        this.time--;
      }
      this.waitTime--;
      this.canKill = this.time > 0;
      if (this.waitTime === 0) {
        this.checkStatus();
      }
      this.hour = Math.floor(this.time / 3600);
      this.minute = Math.floor(this.time / 60 % 60);
      this.second = Math.floor(this.time % 3600 % 60);
    },
    killGoods() {
      if ((new Date(this.miaoShaGoods.endTime).getTime() - new Date().getTime()) < 0) {
        ElementUI.Message.error("本场秒杀已经结束,不能秒杀!!");
        return false;
      }
      let param = new URLSearchParams();
      param.append("miaoShaGoodsId", this.miaoShaGoods.id);
      param.append("goodsId", this.miaoShaGoods.goods.id);
      param.append("userId", window.sessionStorage.getItem("userId"));
      param.append("price", this.miaoShaGoods.price);
      let url = getServerUrl("order/save","miaosha-order1");
      let _this = this;
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios
        .post(url, param)
        .then(function (response) {
          console.log(response.data.success);
          if (response.data.success === true) {
            _this.time = 0;
            _this.waitTime = 5;
            _this.statusMiaoSha = 1;
            ElementUI.Message.success("正在排队中...");
          } else {
            ElementUI.Message.error(response.data.errorInfo);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    checkStatus() {
      let param = new URLSearchParams();
      param.append("miaoShaGoodsId", this.miaoShaGoods.id);
      param.append("userId", window.sessionStorage.getItem("userId"));
      let url = getServerUrl("order/checkStatus","miaosha-order1");
      let _this = this;
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios
        .post(url, param)
        .then(function (response) {
          if (response.data === 1) {
            console.log(response.data);
            _this.statusMiaoSha = 2;
            _this.waitTime = 10000;
            ElementUI.Message.success("你已成功抢到商品");
          } else if (response.data === -1) {
            console.log(response.data);
            _this.statusMiaoSha = 3;
            _this.waitTime = 10000;
            ElementUI.Message.error("你没有抢到商品");
          } else {
            console.log(response.data);
            _this.statusMiaoSha = 1;
            _this.waitTime = 5;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.statusMiaoSha = 0;
      this.waitTime = 10000;
      this.loadData();
    },
    loadData() {
      let url = getServerUrl("miaoShaGoods/listAllNow","miaosha-goods");
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios.defaults.headers.common['userId'] = window.sessionStorage.getItem("userId");
      axios
        .get(url)
        .then(response => (this.listAllNow = response.data))
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  mounted() {
    setInterval(this.timeReduce, 1000);
  },
  created() {
    this.canKill = true;
    this.loadData();
  }
}
</script>

<style scoped>

</style>
