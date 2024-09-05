<script setup>
import HeaderAuth from '../components/common/HeaderAuth.vue';

import { useRouter } from 'vue-router';
import { ref, reactive, inject } from 'vue';
import { register } from '../services/auth';

const router = useRouter();
const formState = reactive({
    phone: '',
    username: '',
    fullname: '',
    password: '',
    confirmPassword: '',
});
const loading = ref(false);
const swal = inject('$swal');

const onFinish = (values) => {
    loading.value = true;
    register(values).then((res) => {
        console.log(res);
        swal.fire({
            title: 'Thành công',
            text: 'Đăng ký thành công',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        router.push('/login');
    }).catch((err) => {
        swal.fire({
            title: 'Thất bại',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }).finally(() => {
        loading.value = false;
    });
};


</script>

<template>
    <div>
        <div id="login">
            <HeaderAuth />
            <div class="login-form" style="margin-top: -15px;">
                <h2 style="text-align: center;">Đăng Ký</h2>
                <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish">
                    <a-form-item label="Số điện thoại" name="phone"
                        :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]">
                        <a-input placeholder="Số điện thoại" size="large" v-model:value="formState.phone" />
                    </a-form-item>
                    <a-form-item label="Tên đăng nhập" name="username"
                        :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]">
                        <a-input placeholder="Tên đăng nhập" size="large" v-model:value="formState.username" />
                    </a-form-item>
                    <a-form-item label="Họ và tên" name="fullname"
                        :rules="[{ required: true, message: 'Vui lòng nhập họ và tên' }]">
                        <a-input placeholder="Họ và tên" size="large" v-model:value="formState.fullname" />
                    </a-form-item>
                    <a-form-item label="Mật khẩu" name="password" :rules="[{ required: true, message: 'Mật khẩu không được để trống' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    ]">
                        <a-input-password v-model:value="formState.password" size="large" placeholder="Mật khẩu"
                            autocomplete="new-password" />
                    </a-form-item>
                    <a-form-item label="Xác nhận mật khẩu" name="confirmPassword" :rules="[{ required: true, message: 'Vui lòng xác nhận mật khẩu' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    {
                        validator: (rule, value, callback) => {
                            console.log(value, formState.password);

                            if (value !== formState.password) {
                                callback('Mật khẩu không khớp');
                            }
                            else { callback(); }
                        }
                    },
                    ]">
                        <a-input-password v-model:value="formState.confirmPassword" size="large"
                            placeholder="Xác nhận mật khẩu" />
                    </a-form-item>
                    <a-form-item style="text-align: center;">
                        <a-button type="primary" html-type="submit" size="large" :loading="loading" :disabled="loading">Đăng Ký</a-button>
                    </a-form-item>
                    <p style="text-align: center;">Bạn đã có tài khoản? <router-link to="/login">Đăng nhập
                            ngay</router-link></p>
                </a-form>
            </div>

        </div>
    </div>
</template>
<style>
#login {
    display: flex;
    justify-content: center;
    flex-direction: column;
    /* align-items: center; */
    height: 100vh;
    background-image: url(@/assets/img/account-bg.jpg);
    background-size: cover;
}

.login-form {
    max-width: 540px;
    width: 90%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 15px;
    background-color: #fff;
}
</style>