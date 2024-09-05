<script setup>
import { ref, onMounted } from 'vue';
import { UserOutlined, DownOutlined, ProfileOutlined, TrademarkCircleOutlined, LoginOutlined } from '@ant-design/icons-vue';
import { getUser } from '@/services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleMenuClick = (e) => {
  console.log('click', e);
};
const user = ref(null);

onMounted( () => {
  getUser().then((response) => {
    user.value = response.user;
  });
});

</script>

<template>
  <a-layout-header>
    <a-row>
      <a-col :span="6">
        <div class="logo">
          <img src="@/assets/img/logo.png" alt="logo" />
        </div>
      </a-col>
      <a-col :span="18" class="flex justify-end" style="text-align: right;">
        <!-- dropdown user -->
        <a-dropdown v-if="user">
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1" @click="router.push('/profile')">
                <ProfileOutlined />
                Trang cá nhân
              </a-menu-item>
              <a-menu-item key="2">
                <TrademarkCircleOutlined />
                Giao dịch
              </a-menu-item>
              <a-menu-item key="3">
                <LoginOutlined />
                Đăng xuất
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary">
            <template #icon>
              <UserOutlined />
            </template>
            {{ user ? user.username : 'Đăng nhập/Đăng ký' }}
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <a-button v-else type="primary" @click="router.push('/login')">
          <template #icon>
            <UserOutlined />
          </template>
          Đăng nhập/Đăng ký
        </a-button>
      </a-col>
    </a-row>
  </a-layout-header>
</template>