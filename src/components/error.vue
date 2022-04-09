<template>
  <div>
    <el-empty description="你请求的链接不存在">
      <h2 style="color: blue"><span style="color: red">{{ time }}</span> 秒后，自动返回上一页</h2>
    </el-empty>
  </div>
</template>

<script>
export default {
  name: "error",
  data() {
    return {
      time: 3
    }
  },
  methods: {
    timeReduce() {
      this.time--;
    }
  },
  mounted() {
    setInterval(this.timeReduce, 1000);
  },
  watch: {
    'time': function (newVal, oldVal) {
      if (newVal === 0) {
        this.$router.go(-1);
      }
    }
  }
}
</script>

<style scoped>

</style>
