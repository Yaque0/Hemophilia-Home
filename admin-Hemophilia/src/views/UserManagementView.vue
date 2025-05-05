<template>
  <div class="user-management">
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : ''">
            {{ scope.row.role === "admin" ? "管理员" : "普通用户" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="updateUserStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="resetPassword(scope.row.id)"
          >
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.page"
      :page-size="pagination.limit"
      :total="pagination.total"
      @current-change="fetchUsers"
    />

    <!-- 编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户信息">
      <el-form :model="currentUser">
        <el-form-item label="用户名">
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="currentUser.email" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentUser.role">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminStore } from "@/store/adminStore";
import { ElMessage } from "element-plus";
import type { User } from "@/types/user";

const adminStore = useAdminStore();
const users = ref<User[]>([]);
const currentUser = ref({
  id: 0,
  username: "",
  email: "",
  role: "user",
});
const dialogVisible = ref(false);

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
});

const fetchUsers = async () => {
  const response = await adminStore.getUsers(pagination.value);
  users.value = response.users; // 直接使用返回的users数组
  pagination.value.total = response.total; // 直接使用返回的total
};

const showEditDialog = (user: User) => {
  // 使用导入的User类型
  currentUser.value = { ...user };
  dialogVisible.value = true;
};
const updateUser = async () => {
  await adminStore.updateUser(currentUser.value.id, {
    username: currentUser.value.username,
    role: currentUser.value.role,
  });
  dialogVisible.value = false;
  fetchUsers();
};

const resetPassword = async (userId: number) => {
  await adminStore.resetPassword(userId);
  ElMessage.success("密码已重置为默认密码");
};

const updateUserStatus = async (user: User) => {
  // 使用导入的User类型
  await adminStore.updateUser(user.id, { status: user.status });
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-management {
  padding: 20px;
}
</style>
