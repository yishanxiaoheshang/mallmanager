<template>
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row>
        <el-col :span="20">
            <el-input placeholder="请输入内容" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span='4'>
            <el-button type="primary">主要按钮</el-button>
        </el-col>
    </el-row>
    <el-table :data="list" stripe style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>

        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="create_time" label="创建日期">
        </el-table-column>
        <el-table-column label="用户状态">
            <el-switch active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
        </el-table-column>
        <el-table-column label="操作">
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    async mounted() {
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get('users?pagenum=1&pagesize=10')
      const {meta,data} = res.data
      if(meta.status===200){
          this.list = data.users
      }
    },
    data() {
        return {
          list:[]
        }
    }
    
}
</script>

<style>

</style>
