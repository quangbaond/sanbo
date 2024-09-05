<script setup>
import HeaderAuth from '@/components/common/HeaderAuth.vue';

import { useRouter } from 'vue-router';
import { ref, reactive, inject } from 'vue';
import { login } from '@/services/auth';
const formState = reactive({
    username: '',
    password: ''
});

const loading = ref(false);
const router = useRouter();

const swal = inject('$swal');

const handleSubmit = (values) => {
    values.isAdmin = true;
    login(values).then(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        swal.fire({
            title: 'Thành công',
            text: 'Đăng nhập thành công',
            icon: 'success'
        })
        router.push('/admin/dashboard');
    }).catch(err => {
        console.log(err);
        swal.fire({
            title: 'Thất bại',
            text: err.response.data.message,
            icon: 'error'
        })
    }).finally(() => {
        loading.value = false;
    })


}
</script>

<template>
    <div>
        <div id="login">
            <!-- <HeaderAuth /> -->
            <div class="login-form">
                <h2 style="text-align: center;">Đăng nhập</h2>
                <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" layout="vertical">
                    <a-form-item label="Tên đăng nhập" name="username"
                        :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]">
                        <a-input placeholder="Tên đăng nhập" size="large" v-model:value="formState.username" />
                    </a-form-item>
                    <a-form-item label="Mật khẩu" name="password"
                        :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]">
                        <a-input-password placeholder="Mật khẩu" size="large" v-model:value="formState.password" />
                    </a-form-item>
                    <a-form-item style="text-align: center;">
                        <a-button type="primary" html-type="submit" size="large" :loading="loading" style="width: 100%;"
                            :disabled="loading">Đăng nhập</a-button>
                    </a-form-item>
                </a-form>
            </div>

        </div>
    </div>
</template>
<style>
#login {
    display: flex;
    /* justify-content: center; */
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