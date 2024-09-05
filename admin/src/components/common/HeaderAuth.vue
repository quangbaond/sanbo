<script setup>
import { useRouter } from 'vue-router';
import { CaretLeftOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const goBack = () => {
    router.push('/');
};
</script>

<template>
    <a-row style="margin-bottom: 20px; padding: 20px;">
        <!-- // btn back -->
        <a-col :span="6" md="6" sm="6" xs="6" lg="6">
            <a-button type="text" html-type="submit" size="large" style="color: #fff;" @click="goBack">
                <CaretLeftOutlined /> Quay lại
            </a-button>
        </a-col>
        <a-col :span="18" style="text-align: right;" >
            <img src="@/assets/img/footer-logo.png" alt="logo" style="width:100px;">
        </a-col>
    </a-row>
</template>

