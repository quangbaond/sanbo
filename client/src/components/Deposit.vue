<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useStore } from 'vuex';
import { getListBank } from '@/services/bank';
import { CopyOutlined } from '@ant-design/icons-vue';
import { formatCurrency, getStaticFile, formatterNumber, parserNumber } from '@/common';
import { createTransaction } from '@/services/transaction';
import { socket } from '@/socket';
const store = useStore();
const user = computed(() => store.state.user.user);
const toast = useToast();
onMounted(() => {
    getListBank().then((res) => {
        console.log(res);
        listBank.value = res.bankData;
    })

});
const transactionData = ref(null);

const amount = ref(0);
const isSubmit = ref(false);


const handleSubmit = (values) => {
    if (!bankSelected.value) {
        toast.error('Vui lòng chọn phương thức nạp tiền');
        return;
    }
    if (!amount.value) {
        toast.error('Vui lòng nhập số tiền');
        return;
    }
    const data = {
        amount: amount.value,
        bankId: bankSelected.value._id,
    }
    createTransaction(data).then((res) => {
        socket.emit('admin-transaction', res.transactionData);
        transactionData.value = res.transactionData;
        isSubmit.value = true;
    });
}
const listBank = ref([])
const bankSelected = ref(null)
const handleSelectBank = (bank) => {
    bankSelected.value = bank;
}
const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã copy mã giao dịch');
}
const isDone = computed(() => store.state.transaction.isDone);
watch(isDone, (newVal, oldVal) => {
    if (newVal) {
        isSubmit.value = false;
        amount.value = 0;
        bankSelected.value = null;
    }
});
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
        <a-row>
            <div class="alert-deposit">
                <p>*Lưu ý: Nếu số tiền và mã Nội dung không trùng khớp, hệ thống sẽ gặp vấn đề trong việc xử lý nạp tiền
                    của bạn.</p>
                <p>1. Thông tin tài khoản ngân hàng do chúng tôi cung cấp, Quý khách chỉ được sử dụng 1 (một)
                    lần. Chúng tôi sẽ không chịu trách nhiệm về các mất mát nếu Quý Khách chuyển tiền vào tài
                    khoản ngân hàng cũ.</p>


                <p>2. Khi nạp tiền, Quý khách vui lòng chọn hình thức phí chuyển 'Người/Đơn vị chuyển trả phí'
                    để
                    nhận được chính xác số tiền khi nạp tiền.</p>
                <p>3.Vui lòng liên hệ với bộ phận chăm sóc khách hàng nếu có bất kỳ thắc mắc nào khác.</p>
            </div>
        </a-row>
        <div class="bank-list" v-if="!isSubmit">
            <a-row>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">

                </a-col>
            </a-row>
            <a-row style="margin-top: 20px;" :gutter="16">
                <div>
                    <h3>1. Chọn phương thức nạp tiền:</h3>
                    <div id="list_bank">
                        <a-row :gutter="16" justify="center">
                            <a-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4" v-for="bank in listBank" :key="bank._id"
                                @click="handleSelectBank(bank)">
                                <a-card style="border: 1px solid #d9d9d9;" class="bank-item"
                                    :class="{ 'bank-item-selected':  bankSelected?._id === bank._id }">
                                    <img :src="getStaticFile(bank.image)" alt="logo"
                                        style="width: 100%; height: 100%;" />
                                </a-card>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-top: 20px;">
                    <div>
                        <h3>2. Nhập số tiền nạp:</h3>
                        <a-input-number v-model:value="amount" style="width: 100%;"
                            placeholder="Vui lòng nạp tối thiểu 50.000 VNĐ" size="large" :min="50000"
                            :formatter="formatterNumber" :parser="parserNumber" />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-top: 20px;">
                    <div>
                        <h3>Tạo yêu cầu:</h3>
                        <a-button type="primary" style="width: 100%;" size="large" @click="handleSubmit">Nạp
                            tiền</a-button>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="bank_info" v-else style="margin-top: 20px;">
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-row align="middle" justify="space-between" class="info-item">
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3 style="color: #1890ff;">Mã yêu cầu</h3>
                        </a-col>
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3 style="color: #1890ff;">{{ transactionData?.code }}</h3>
                        </a-col>
                        <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
                            <a-button class="btn-copy" size="small" @click="handleCopy(transactionData?.code)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>

                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-row align="middle" justify="space-between" class="info-item">
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>Ngân hàng</h3>
                        </a-col>
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>{{ bankSelected?.bankName }}</h3>
                        </a-col>
                        <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
                            <a-button class="btn-copy" size="small" @click="handleCopy(bankSelected?.bankName)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-row align="middle" justify="space-between" class="info-item">
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>Số tài khoản</h3>
                        </a-col>
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>{{ bankSelected?.bankNumberAccount }}</h3>
                        </a-col>
                        <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
                            <a-button class="btn-copy" size="small"
                                @click="handleCopy(bankSelected?.bankNumberAccount)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>

                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-row align="middle" justify="space-between" class="info-item">
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>Tên người nhận</h3>
                        </a-col>
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>{{ bankSelected?.bankNameAccount }}</h3>
                        </a-col>
                        <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
                            <a-button class="btn-copy" size="small" @click="handleCopy(bankSelected?.bankNameAccount)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>

                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-row align="middle" justify="space-between" class="info-item">
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>Số tiền</h3>
                        </a-col>
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>{{ formatCurrency(amount) }}</h3>
                        </a-col>
                        <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
                            <a-button class="btn-copy" size="small" @click="handleCopy(amount)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-row align="middle" justify="space-between" class="info-item">
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>Nội dung</h3>
                        </a-col>
                        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                            <h3>{{ user?.code }}</h3>
                        </a-col>
                        <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
                            <a-button class="btn-copy" size="small" @click="handleCopy(user?.code)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </div>
    <a-row v-if="!isDone && isSubmit" style="margin-top: 20px;">
        <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="24" style="text-align: center;">
            <a-spin style="font-size: 20px; margin-right: 10px;" /> <span style="font-size: 20px; color: #1890ff;">Đang
                đợi giao dịch...</span>
        </a-col>
    </a-row>
</template>

<style>
.alert-deposit {
    background-color: #d4edda;
    padding: 15px;
    border-radius: 10px;
    margin-top: 10px;
    border: 1px solid #c3e6cb;
    color: #155724;
    font-size: 16px;
}
.bank-item {
    cursor: pointer;
}
.bank-item .ant-card-body {
    padding: 5px !important;
}

.bank-item-selected {
    border: 3px solid #1890ff !important;
}
.info-item {
    margin-bottom: 20px;
    border-bottom: 1px solid #d9d9d9;
}
.btn-copy {
    background-color: #1890ff;
    color: #fff;
    margin-bottom: 10px;
}

.alert-deposit p {
    font-weight: 500;
}

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