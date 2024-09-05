<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { getTradeData } from '@/services/trade';
import moment from 'moment';
import { formatCurrency } from '@/common';
const store = useStore();
const user = computed(() => store.state.user.user);
const columns = [

    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: (text) => {
            return moment(text).format('DD/MM/YYYY HH:mm');
        }
    },
    {
        title: 'Loại giao dịch',
        dataIndex: 'session',
        key: 'session',
        customRender: (text) => {
            console.log(text);
            return text.text?.room ? text.text?.room?.name : '';
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        key: 'amount',
        customRender: (text) => {
            return formatCurrency(text.text);
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        customRender: (text) => {
            return text.text ? text.text?.status === 'success' ? 'Thành công' : 'Thất bại' : 'Đang chờ';
        }
    }

]
const data = ref([]);

const tradeData = ref([]);

onMounted(() => {
    getTradeData().then((res) => {
        data.value = res.tradeData;
    });
});
const at = window.innerWidth <= 768 ? "mobile" : "pc";

const scroll = at == "mobile" ? { x: 700, y: 700 } : {};

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
        <a-row style="margin-top: 16px;">
            <a-col :span="24">
                <a-card style="background-color: #f0f2f5;">
                    <a-row :gutter="16">
                        <a-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 16px;">
                            <a-card class="card-info custom">
                                <a-card-body class="custom">
                                    <a-row align="middle">
                                        <a-col :span="24">
                                            <a-row align="middle" justify="space-between" style="position: relative;">
                                                <a-col :span="12" style="text-align: center;">
                                                    <span
                                                        style="font-size: 20px; text-align: center; font-weight: bold;">Bạc</span>
                                                </a-col>
                                                <a-col :span="12">
                                                    <span class="index-text-1"><b>5 chỉ số</b></span>
                                                </a-col>
                                            </a-row>
                                            <a-row align="middle" justify="space-between"
                                                style="position: relative; margin-top: 20px;">
                                                <a-col :span="12" style="text-align: center;">
                                                    <div style="text-align: center;">
                                                        <img src="@/assets/img/offer1.png" alt="logo" />
                                                    </div>
                                                    <div style="height: 40px;">
                                                        <div style="">
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Vốn
                                                                tối thiểu</span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">0
                                                                VNĐ</span>
                                                        </div>
                                                    </div>
                                                </a-col>
                                                <a-col :span="12" style="text-align: center;">
                                                    <div style="text-align: center;">
                                                        <img src="@/assets/img/offer1.png" alt="logo" />
                                                    </div>
                                                    <div style="height: 40px;">
                                                        <div style="">
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Vốn
                                                                tối đa</span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">1,000,000,000
                                                                VNĐ</span>
                                                        </div>
                                                    </div>
                                                </a-col>
                                            </a-row>
                                        </a-col>
                                    </a-row>
                                </a-card-body>
                            </a-card>
                        </a-col>
                        <a-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 16px;">
                            <a-card class="card-info custom">
                                <a-card-body class="custom">
                                    <a-row align="middle">
                                        <a-col :span="24">
                                            <a-row align="middle" justify="space-between" style="position: relative;">
                                                <a-col :span="12" style="text-align: center;">
                                                    <span
                                                        style="font-size: 20px; text-align: center; font-weight: bold;">Vàng</span>
                                                </a-col>
                                                <a-col :span="12">
                                                    <span class="index-text-1"><b>7 chỉ số</b></span>
                                                </a-col>
                                            </a-row>
                                            <a-row align="middle" justify="space-between"
                                                style="position: relative; margin-top: 20px;">
                                                <a-col :span="12" style="text-align: center;">
                                                    <div style="text-align: center;">
                                                        <img src="@/assets/img/offer1.png" alt="logo" />
                                                    </div>
                                                    <div style="height: 40px;">
                                                        <div style="">
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Vốn
                                                                tối thiểu</span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">1,000,000
                                                                VNĐ</span>
                                                        </div>
                                                    </div>
                                                </a-col>
                                                <a-col :span="12" style="text-align: center;">
                                                    <div style="text-align: center;">
                                                        <img src="@/assets/img/offer1.png" alt="logo" />
                                                    </div>
                                                    <div style="height: 40px;">
                                                        <div style="">
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Vốn
                                                                tối đa</span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">5,000,000
                                                                VNĐ</span>
                                                        </div>
                                                    </div>
                                                </a-col>
                                            </a-row>
                                        </a-col>
                                    </a-row>
                                </a-card-body>
                            </a-card>
                        </a-col>
                        <a-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 16px;">
                            <a-card class="card-info custom">
                                <a-card-body class="custom">
                                    <a-row align="middle">
                                        <a-col :span="24">
                                            <a-row align="middle" justify="space-between" style="position: relative;">
                                                <a-col :span="10" style="text-align: center;">
                                                    <span
                                                        style="font-size: 18px; text-align: center; font-weight: bold;">Kim
                                                        Cương</span>
                                                </a-col>
                                                <a-col :span="14">
                                                    <span class="index-text-1"><b>10 chỉ số</b></span>
                                                </a-col>
                                            </a-row>
                                            <a-row align="middle" justify="space-between"
                                                style="position: relative; margin-top: 20px;">
                                                <a-col :span="12" style="text-align: center;">
                                                    <div style="text-align: center;">
                                                        <img src="@/assets/img/offer1.png" alt="logo" />
                                                    </div>
                                                    <div style="height: 40px;">
                                                        <div style="">
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Vốn
                                                                tối thiểu</span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">5,000,000
                                                                VNĐ</span>
                                                        </div>
                                                    </div>
                                                </a-col>
                                                <a-col :span="12" style="text-align: center;">
                                                    <div style="text-align: center;">
                                                        <img src="@/assets/img/offer1.png" alt="logo" />
                                                    </div>
                                                    <div style="height: 40px;">
                                                        <div style="">
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Vốn
                                                                tối đa</span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                style="font-size: 16px; text-align: center; font-weight: bold;">Không
                                                                giới
                                                                hạn</span>
                                                        </div>
                                                    </div>
                                                </a-col>
                                            </a-row>
                                        </a-col>
                                    </a-row>
                                </a-card-body>
                            </a-card>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
            <a-col :span="24">
                <a-card title="Giao dịch mới nhất">
                    <a-table :columns="columns" :data-source="data" :pagination="false"
                        :locale="{ emptyText: 'Không có giao dịch nào' }" :scroll="scroll" bordered="true" />
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
</style>