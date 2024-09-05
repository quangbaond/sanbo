<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { getTradeData } from '@/services/trade';
import moment from 'moment';
import { formatCurrency } from '../common';
import { UserOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { getStaticFile } from '../common';
import { useToast } from 'vue-toast-notification';
import { getUser } from '@/services/auth';
import { updatePassword } from '@/services/auth';
const toast = useToast();
const store = useStore();
const user = ref(JSON.parse(localStorage.getItem('user')));
import { updateAvatar } from '@/services/auth';
import { updateProfile } from '@/services/auth';


onMounted(() => {
    getUser().then((res) => {
        user.value = res.user;
        console.log(user.value);
        store.commit('user/setUser', res.user);
    });
});
const at = window.innerWidth <= 768 ? "mobile" : "pc";


const loading = ref(false);

const handleSubmit = (values) => {
    console.log(values);
    updateProfile(values).then((res) => {
        toast.success('Cập nhật thành công');
        store.commit('user/setUser', res.user);
    });
}
const fileList = ref([]);
const urlUpload = import.meta.env.VITE_API_UPLOAD_URL || 'http://localhost:3000/upload';
const handleChangeAvatar = (info) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        updateAvatar({
            avatar: info.file.response.url
        }).then((res) => {
            toast.success('Cập nhật thành công');
            store.commit('user/setUser', res.user);
            fileList.value = [];
        });
    } else if (info.file.status === 'error') {

    }
}
const form = ref({
    fullname: user.value?.fullname,
    phone: user.value?.phone,
    address: user.value?.address,
});

watch(user, (newVal, oldVal) => {
    form.value.fullname = newVal.fullname;
    form.value.phone = newVal.phone;
    form.value.address = newVal.address;
});

const formPassword = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const handleChangePassword = (values) => {
    loading.value = true;
    updatePassword(values).then((res) => {
        toast.success('Cập nhật thành công');
        formPassword.value = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
    }).catch((err) => {
        toast.error(err.response.data.message);
    }).finally(() => {
        loading.value = false;
    });
}
</script>

<template>
    <h1>Trung tâm hội viên</h1>
    <div class="dashboard">
        <a-row>
            <a-col :span="24">
                <a-card style="background-color: #f0f2f5;">
                    <a-row :gutter="16">
                        <a-col :span="24" :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 16px;">
                            <a-card class="card-info">
                                <a-card-body>
                                    <a-row align="middle">
                                        <a-col :span="20">
                                            <span style="font-size: 18px;">Tài khoản: <span>{{ user?.username
                                                    }}</span></span>
                                            <br>
                                            <span style='color: green; font-size: 18px;'>{{ user?.phone }}</span>
                                        </a-col>
                                        <a-col :span="4">
                                            <img src="@/assets/img/card-img.png" alt="logo" style="width: 100%;" />
                                        </a-col>
                                    </a-row>
                                </a-card-body>
                            </a-card>
                        </a-col>
                        <a-col :span="24" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <a-card class="card-info">
                                <a-card-body>
                                    <a-row align="middle">
                                        <a-col :span="20">
                                            <span style="font-size: 18px;">Số dư ví điện tử</span>
                                            <br>
                                            <span style='color: green; font-size: 18px;'>{{
                                                formatCurrency(user?.balance) }}</span>
                                        </a-col>
                                        <a-col :span="4">
                                            <img src="@/assets/img/card-img.png" alt="logo" style="width: 100%;" />
                                        </a-col>
                                    </a-row>
                                </a-card-body>
                            </a-card>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-top: 16px;">
                <a-card title="Thông tin cá nhân">
                    <a-card-body>
                        <a-row align="middle" justify="center" style="text-align: center;">
                            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <a-avatar v-if="user?.avatar" :src="getStaticFile(user?.avatar)" :size="100">
                                </a-avatar>
                                <a-avatar v-else :size="100">
                                    <template #icon>
                                        <UserOutlined />
                                    </template>
                                </a-avatar>

                            </a-col>
                            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 16px;">
                                <!-- // upload avatar -->
                                <a-upload v-model:file-list="fileList" name="file" :multiple="false" :action="urlUpload"
                                    @change="handleChangeAvatar" :show-upload-list="false" accept="image/*">
                                    <a-button>
                                        <template #icon>
                                            <UploadOutlined />
                                        </template>
                                        Tải lên ảnh đại diện
                                    </a-button>
                                </a-upload>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <a-form :model="form" layout="vertical" @finish="handleSubmit">
                                    <a-form-item label="Mã tham chiếu">
                                        <a-input v-model:value="user.code" disabled />
                                    </a-form-item>
                                    <a-form-item label="Họ và tên" name="fullname">
                                        <a-input v-model:value="form.fullname" :disabled="user.fullname != ''" />
                                    </a-form-item>
                                    <a-form-item label="Số điện thoại" name="phone">
                                        <a-input v-model:value="form.phone" :disabled="user.phone !== ''" />
                                    </a-form-item>
                                    <a-form-item label="Địa chỉ" name="address">
                                        <a-input v-model:value="form.address" :disabled="user.address !== ''" />
                                    </a-form-item>
                                    <a-button style="width: 30%;" type="primary" html-type="submit" :loading="loading"
                                        :disabled="loading">Lưu</a-button>
                                </a-form>
                            </a-col>
                        </a-row>
                    </a-card-body>
                </a-card>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-top: 16px;">
                <a-card title="Thay đổi mật khẩu">
                    <a-card-body>
                        <a-row>
                            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <a-form :model="formPassword" layout="vertical" @finish="handleChangePassword">
                                    <a-form-item label="Mật khẩu cũ"
                                        :rules="[{required: true, message: 'Mật khẩu cũ không được để trống'}]"
                                        name="oldPassword">
                                        <a-input-password v-model:value="formPassword.oldPassword" />
                                    </a-form-item>
                                    <a-form-item label="Mật khẩu mới"
                                        :rules="[{required: true, message: 'Mật khẩu mới không được để trống'}]"
                                        name="newPassword">
                                        <a-input-password v-model:value="formPassword.newPassword" />
                                    </a-form-item>
                                    <a-form-item label="Nhập lại mật khẩu mới"
                                        :rules="[{required: true, message: 'Nhập lại mật khẩu mới không được để trống'}, {validator: (rule, value, callback) => {if (value !== formPassword.newPassword) {callback('Mật khẩu mới không khớp');} else {callback();}}}]"
                                        name="confirmPassword">
                                        <a-input-password v-model:value="formPassword.confirmPassword" />
                                    </a-form-item>
                                    <a-button style="width: 30%;" type="primary" html-type="submit" :loading="loading"
                                        :disabled="loading">Lưu</a-button>
                                </a-form>
                            </a-col>
                        </a-row>
                    </a-card-body>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<style>
.card-info {
    background-image: url(@/assets/img/card-bg.jpg);
    background-size: cover;
    background-position: center;
}

.index-text-1 {
    display: inline-block;
    color: #fff;
    background: #1554c2;
    text-transform: uppercase;
    position: relative;
    border-radius: 22px;
    height: 44px;
    line-height: 42px;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.index-text-1::after {
    content: '';
    width: 143px;
    background: #1554c2;
    z-index: 0;
    height: 44px;
    mask: url(@/assets/img/offer-shape.png) no-repeat center center;
    -webkit-mask: url(@/assets/img/offer-shape.png) no-repeat center center;
    mask-size: cover;
    -webkit-mask-size: cover;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    display: block;
    z-index: -1;
}

.card-info .ant-card-body .custom {
    padding: 10px !important;
}

.ant-picker {
    width: 100%;
}
</style>