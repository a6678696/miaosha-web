<template>
  <div style="margin-left: -21%">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false">
      <span>是否要支付？</span>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="pay()">是</el-button>
              <el-button type="danger" @click="dialogVisible = false">否</el-button>
            </span>
    </el-dialog>
    <el-table
      :data="listMyOrder"
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
        label="价格"
        prop="price" align="center">
      </el-table-column>
      <el-table-column
        label="时间"
        prop="createTime" align="center">
      </el-table-column>
      <el-table-column
        label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="openDialog(scope.row.id)" v-if="scope.row.payStatus===0">支付
          </el-button>
          <el-tag type="success" v-if="scope.row.payStatus===1">已支付</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ElementUI from 'element-ui';
import axios from "axios";
import {getServerUrl} from "@/config/url";

export default {
  name: "listMyOrder",
  data() {
    return {
      listMyOrder: null,
      dialogVisible: false
    }
  },
  methods: {
    pay() {
      let _this = this;
      let url = getServerUrl("order/save?id=" + window.sessionStorage.getItem("payOrderId") + "&payStatus=1","miaosha-order1");
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios
        .post(url)
        .then(function (response) {
          console.log(response.data.success);
          if (response.data.success === true) {
            ElementUI.Message.success("支付成功");
            _this.loadData();
            _this.dialogVisible = false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadData() {
      let url = getServerUrl("order/list?userId=" + window.sessionStorage.getItem("userId"),"miaosha-order1");
      axios.defaults.headers.common['token'] = window.sessionStorage.getItem("token");
      axios
        .get(url)
        .then(response => (this.listMyOrder = response.data.rows))
        .catch(function (error) {
          console.log(error);
        });
    },
    openDialog: function (id) {
      this.dialogVisible = true;
      sessionStorage.setItem("payOrderId", id);
    }
  },
  created() {
    this.loadData();
  }
}
</script>

<style scoped>

</style>
