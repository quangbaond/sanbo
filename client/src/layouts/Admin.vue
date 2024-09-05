<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/common/Footer.vue';
import { getUser } from '@/services/auth';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, NotificationOutlined, ProfileOutlined, TrademarkCircleOutlined, LoginOutlined, DownOutlined, LockOutlined, DashboardOutlined, TransactionOutlined, HistoryOutlined, MoneyCollectOutlined } from '@ant-design/icons-vue';
import store from '@/store';
const collapsed = ref(false);
const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
};
const user = ref(JSON.parse(localStorage.getItem('user')));
const props = defineProps({
    selectedKeys: {
        type: Array,
        default: ['1']
    }
})

onMounted(() => {
    getUser().then((res) => {
        user.value = res.user;
        console.log(res.user);
        store.commit('user/setUser', res.user);
    });
});

const router = useRouter();
const handleMenuClick = (e) => {
    // if (e.key === '3') {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     router.push('/login');
    // }
}
</script>

<template>
    <a-layout class="layout">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :breakpoint="'lg'"
            :collapsedWidth="0">
            <div class="logo">
                <img src="@/assets/img/logo.png" alt="Logo" />
            </div>
            <a-menu theme="dark" mode="inline" :selectedKeys="selectedKeys">
                <a-menu-item key="1" @click="router.push('/dashboard')">
                    <DashboardOutlined />
                    <span>Tổng quan</span>
                </a-menu-item>
                <!-- // giao dịch -->
                <a-menu-item key="2" @click="router.push('/trade')">
                    <TransactionOutlined />
                    <span>Giao dịch</span>
                </a-menu-item>
                <!-- // lịch sử giao dịch -->
                <a-menu-item key="3">
                    <HistoryOutlined />
                    <span>Lịch sử giao dịch</span>
                </a-menu-item>
                <!-- // nạp tiền -->
                <a-menu-item key="4">
                    <MoneyCollectOutlined />
                    <span>Nạp tiền</span>
                </a-menu-item>
                <!-- // rút tiền -->
                <a-menu-item key="5">
                    <MoneyCollectOutlined />
                    <span>Rút tiền</span>
                </a-menu-item>
                <!-- // hồ sơ -->
                <a-menu-item key="6">
                    <ProfileOutlined />
                    <span>Hồ sơ</span>
                </a-menu-item>
                <!-- // đăng xuất -->
                <a-menu-item key="7">
                    <LoginOutlined />
                    <span>Đăng xuất</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #001529; padding: 0">
                <a-row>
                    <a-col :span="12">
                        <!-- <Header /> -->
                        <MenuUnfoldOutlined v-if="collapsed" class="trigger" @click="toggleCollapsed"
                            style="color: #fff;" />
                        <MenuFoldOutlined v-else class="trigger" @click="toggleCollapsed" style="color: #fff;" />
                    </a-col>
                    <a-col :span="12" style="text-align: right;">
                        <a-row :gutter="10" justify="end" align="middle">
                            <a-col :span="6" :md="3" style="align-self: center; display: flex;">
                                <a-badge :count="6">
                                    <NotificationOutlined style="font-size: 25px; color: #fff;" />
                                </a-badge>
                            </a-col>
                            <a-col :span="18" :md="6">
                                <a-dropdown v-if="user">
                                    <template #overlay>
                                        <a-menu @click="handleMenuClick" :selectedKeys="['1']" theme="dark"
                                            mode="inline" style="background: #001529;">
                                            <a-menu-item key="1" @click="router.push('/profile')">
                                                <LockOutlined />
                                                Đổi mật khẩu
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
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>

            </a-layout-header>
            <a-layout-content>
                <div :style="{ background: '#fff', padding: '24px', minHeight: '86vh' }">
                    <router-view />
                </div>
            </a-layout-content>
            <Footer />
        </a-layout>
    </a-layout>
</template>

<style scoped>
.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.logo {
    /* height: 32px; */
    /* background: rgba(255, 255, 255, 0.2); */
    margin: 16px;
}
</style>