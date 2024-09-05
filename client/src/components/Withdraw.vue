<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useStore } from 'vuex';
import { getListBank } from '@/services/bank';
import { CopyOutlined } from '@ant-design/icons-vue';
import { formatCurrency, getStaticFile, formatterNumber, parserNumber } from '@/common';
import { createTransaction } from '@/services/transaction';
import { socket } from '@/socket';
import { banks } from '@/common/const';
import { updateBank } from '@/services/auth';
const store = useStore();
const user = computed(() => store.state.user.user);
const toast = useToast();
const fileList = ref([]);
onMounted(() => {

});
const urlUpload = import.meta.env.VITE_API_UPLOAD_URL || 'http://localhost:3000/upload';
const handleChangeBefore = (info) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        form.value.cccdBefore = info.file.response.url;
    } else if (info.file.status === 'error') {

    }
}
const handleChangeAfter = (info) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        form.value.cccdAfter = info.file.response.url;
    }
}
const optionsBank = ref(banks.map((bank) => ({
    value: bank.short_name,
    label: bank.name,
})))

const amount = ref(0);
const isSubmit = ref(false);


const handleSubmitAddBank = (values) => {
    const data = {
        ...form.value,
        ...values,
    }
    console.log(data)
    if(!data.cccdBefore || !data.cccdAfter) {
        toast.error('Vui lòng chọn ảnh CCCD trước và sau');
        return;
    }

    updateBank(data).then((res) => {
        toast.success('Cập nhật thông tin thành công');
        store.commit('user/setUser', res.user);
    }).catch((err) => {
        toast.error('Cập nhật thông tin thất bại');
    });
    // createTransaction(data).then((res) => {
    //     socket.emit('admin-transaction', res.transactionData);
    //     isSubmit.value = true;
    // });
}
const form = ref({
    bankName: '',
    bankNumberAccount: '',
    bankNameAccount: '',
    bankBranch: '',
    cccdBefore: '',
    cccdAfter: '',
})
const formWithdraw = ref({
    amount: 0,
})
const loading = ref(false);
const handleSubmitWithdraw = (values) => {
    if(formWithdraw.value.amount < 100000) {
        toast.error('Số tiền rút tối thiểu là 100.000 VNĐ');
        return;
    }
    if(formWithdraw.value.amount > user.value.balance) {
        toast.error('Số tiền rút vượt quá số dư ví điện tử');
        return;
    }
    loading.value = true;
    createTransaction({
        amount: formWithdraw.value.amount,
        type: 'withdraw',
    }).then((res) => {
        console.log(res)
        toast.success('Rút tiền thành công');
    }).catch((err) => {
        toast.error('Rút tiền thất bại');
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
    </div>
    <div class="alert" v-if="!user?.bankName" style="margin-top: 20px;">
        <a-alert
            message="Để thực hiện rút tiền, bạn cần liên kết tài khoản ngân hàng. Xin lưu ý, để đảm bảo thông tin đăng ký rút tiền, CMND, tên tài khoản ngân hàng phải giống nhau"
            type="info" show-icon />
    </div>
    <div class="form-bank" v-if="!user?.bankName" style="margin-top: 20px;">
        <a-form :model="form" layout="vertical" @finish="handleSubmitAddBank">
            <a-card title="Thông tin ngân hàng">

                <a-row align="middle" :gutter="16">
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Ngân hàng" name="bankName"
                            :rules="[{ required: true, message: 'Vui lòng chọn ngân hàng' }]">
                            <a-select v-model:value="form.bankName" :options="optionsBank" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Tên tài khoản" name="bankNameAccount"
                            :rules="[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]">
                            <a-input v-model:value="form.bankNameAccount" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Số tài khoản" name="bankNumberAccount"
                            :rules="[{ required: true, message: 'Vui lòng nhập số tài khoản' }]">
                            <a-input v-model:value="form.bankNumberAccount" />
                        </a-form-item>
                    </a-col>

                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Chi nhánh" name="bankBranch"
                            :rules="[{ required: true, message: 'Vui lòng nhập chi nhánh' }]">
                            <a-input v-model:value="form.bankBranch" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <a-row :gutter="16" justify="space-between">
                            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <a-upload v-model:file-list="fileListBefore" name="file" :multiple="false"
                                    :action="urlUpload" @change="handleChangeBefore" list-type="picture-card"
                                    :show-upload-list="false">
                                    <img v-if="form.cccdBefore" :src="getStaticFile(form.cccdBefore)" alt="avatar"
                                        style="width: 100%; height: 100%;" />
                                    <div v-else>
                                        <loading-outlined v-if="loading"></loading-outlined>
                                        <plus-outlined v-else></plus-outlined>
                                        <div class="ant-upload-text">CCCD mặt trước</div>
                                    </div>
                                </a-upload>
                            </a-col>
                            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <a-upload v-model:file-list="fileListAfter" name="file" :multiple="false"
                                    :action="urlUpload" @change="handleChangeAfter" list-type="picture-card"
                                    :show-upload-list="false">
                                    <img v-if="form.cccdAfter" :src="getStaticFile(form.cccdAfter)" alt="avatar"
                                        style="width: 100%; height: 100%;" />
                                    <div v-else>
                                        <loading-outlined v-if="loading"></loading-outlined>
                                        <plus-outlined v-else></plus-outlined>
                                        <div class="ant-upload-text">CCCD mặt sau</div>
                                    </div>
                                </a-upload>
                            </a-col>
                        </a-row>


                    </a-col>

                </a-row>
                <a-card-footer>
                    <a-row align="middle" justify="center">
                        <a-col :span="24" style="text-align: center;">
                            <a-button type="primary" html-type="submit">Lưu thông tin</a-button>
                        </a-col>
                    </a-row>
                </a-card-footer>
            </a-card>

        </a-form>
    </div>

    <!-- // rút tiền -->
    <div class="form-withdraw" v-if="user?.bankName" style="margin-top: 20px;">
        <a-form :model="formWithdraw" layout="vertical" @finish="handleSubmitWithdraw">
            <a-card title="Rút tiền">
                <a-row :gutter="16">
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Ngân hàng" name="bankName">
                            <a-input v-model:value="user.bankName" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Số tài khoản" name="bankNumberAccount">
                            <a-input v-model:value="user.bankNumberAccount" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Số tài khoản" name="bankNumberAccount">
                            <a-input v-model:value="user.bankNumberAccount" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Số tài khoản" name="bankNumberAccount">
                            <a-input v-model:value="user.bankNumberAccount" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Ví điện tử">
                            <a-input-number style="width: 100%;" v-model:value="user.balance" disabled  :formatter="formatterNumber" :parser="parserNumber"/>
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <a-form-item label="Số tiền" name="amount"
                            :rules="[{ required: true, message: 'Vui lòng nhập số tiền' }]">
                            <a-input-number style="width: 100%;" v-model:value="formWithdraw.amount" :formatter="formatterNumber" :parser="parserNumber" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="text-align: right;">
                        <a-button type="primary" html-type="submit" :loading="loading">Rút tiền</a-button>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
    </div>
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
.ant-upload-select-picture-card {
    width: 100% !important;
    /* height: 100% !important; */
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