<template>
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchArea">
        <el-col :span="8">
            <el-input clearable v-model="searchVal" class="searchInput" placeholder="请输入内容">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span='4'>
            <el-button type="primary" @click="showDiaAddUser()">添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleuser">
        <el-form>
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <!-- 需要一个用户名 -->
                {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                    <!-- v-model绑定的值 和 el-option的value值 如果一样
                    当前显示的就是该option的label值
                   -->
                    <el-option disabled label="请选择" :value="-1"></el-option>
                    <el-option v-for="(item,index) in roles" :key="index" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRoleuser = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" stripe style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>

        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.creat_time | fmtDate}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态">
            <template slot-scope="scope">
                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>

        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-row>
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showRoledia(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    mounted() {
        this.loadTableData()
    },
    methods: {
        // 分配角色 修改用户状态
       async setRole(){
            // 关闭对话框
            this.dialogFormVisibleRoleuser = false
          const res =   this.$http.put(`users/${this.getRoleByUserId}/role`,{
              rid:this.currRoleId
          })
            const {meta:{status,msg}} = res.data
            if(status===200){
                this.$message.success(msg)
            }
        },
        // 分配角色
        async showRoledia(user) {
            this.getRoleByUserId = user.id
            this.dialogFormVisibleRoleuser = true
            this.currUserName = user.username
            const res = await this.$http.get('roles')
            this.roles = res.data.data
            // 显示当前用户角色
            const res1 = await this.$http.get(`users/${user.id}`)
            this.currRoleId = res1.data.data.rid
        },
        // 编辑用户  发送表单
        async editUser() {
            this.dialogFormVisibleEdituser = false
            // 发送请求
            const res = await this.$http.put(`users/${this.currUserId}`, this.formData)

            // 提示编辑成功
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status === 200) {
                this.$message.success(msg)
                // this.loadTableData()
            }
        },
        // 编辑用户  显示对话框、
        showEditdia(user) {
            // console.log(user)
            this.dialogFormVisibleEdituser = true
            // var per = {
            //     name :'acb'
            // }
            // per = {name:'xxx',age:10}
            this.formData = user
            this.currUserId = user.id
        },
        // 添加用户-表单提交
        async addUser() {
            // 关闭对话框
            this.dialogFormVisibleAdduser = false
            // 发送post请求
            const res = await this.$http.post('users', this.formData)
            console.log(res)
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 201) {
                for (const key in this.formData) {
                    if (this.formData.hasOwnProperty(key)) {
                        this.formData[key] = ''
                    }
                }
                // 提示框
                this.$message.success(msg)
                this.loadTableData()
            }
        },
        // 添加用户- 显示对话框
        showDiaAddUser() {
            this.dialogFormVisibleAdduser = true
        },
        // 弹出删除提示框
        showDelefirm(user) {
            this.$confirm('Sure?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(async () => {
                    // 发送请求
                    // users/:id
                    const res = await this.$http.delete(`users/${user.id}`)
                    // console.log(res)
                    const {
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.pagenum = 1
                        this.loadTableData() // pagenum=1
                        this.$message.success(msg)
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        // 修改用户状态
        async changeMgState(user) {
            // 发送请求
            const res = await this.$http.put(
                `users/${user.id}/state/${user.mg_state}`
            )
            // console.log(res)
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status === 200) {
                // 提示框
                this.$message.success(msg)
            }
        },
        // 搜索用户
        async searchUser() {
            this.loadTableData()
        },
        // 分页相关方法
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.loadTableData()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.loadTableData()
        },
        async loadTableData() {
            this.loading = true
            const AUTH_TOKEN = sessionStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query${this.searchVal}`)
            const {
                meta,
                data
            } = res.data
            if (meta.status === 200) {

                this.total = res.data.data.total
                this.loading = false
                this.list = data.users
            }
        }
    },
    data() {
        return {
            list: [],
            // 加载动画
            loading: false,
            // 分页相关数据
            pagenum: 1,
            pagesize: 10,
            total: 10,
            currentPage: 1,
            // 搜索关键字
            searchVal: '',
            dialogFormVisibleAdduser: false,
            // 添加用户的用户表单数据
            formData: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            formLabelWidth: '140px',
            // 编辑
            dialogFormVisibleEdituser: false,
            currUserId: -1,
            // 分配角色对话框
            dialogFormVisibleRoleuser: false,
            currUserName: '',
            // 当前角色id
            currUserId:-1,
            roles:[],
            getRoleByUserId :-1
        }

    }

}
</script>

<style>
.box-card {
    height: 100%;
}

.searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
}

.searchArea .input-with-select {
    width: 350px;
}
</style>
