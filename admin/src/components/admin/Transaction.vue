<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import { message } from 'ant-design-vue';
import { getTransaction, updateTransaction, deleteTransaction } from '@/services/transaction';
import { formatCurrency } from '@/common';
import { useToast } from 'vue-toast-notification';
import { socket } from '@/socket';
const store = useStore();
const user = computed(() => store.state.user.user);
const toast = useToast();
const columns = [

    {
        title: 'Mã giao dịch',
        dataIndex: 'code',
        key: 'code',

    },
    {
        title: 'Ngân hàng',
        dataIndex: 'bank',
        key: 'bank',
        customRender: (text) => {
            return text.text ? text.text?.bankName : '-';
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        key: 'amount',
        customRender: (text) => {
            return text.text ? formatCurrency(text.text) : '-';
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Ngày giao dịch',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: (text) => {
            return moment(text).format('DD/MM/YYYY HH:mm:ss');
        }
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
    }

]
const data = ref([]);

onMounted(() => {
    getTransactionData();
    socket.on('admin-transaction', (transaction) => {
        getTransactionData();
    });
});
const getTransactionData = () => {
    getTransaction().then((res) => {
        console.log(res);
        data.value = res.transactionData.docs;
    }).catch((error) => {
        console.log(error);
    });
}
const at = window.innerWidth <= 768 ? "mobile" : "pc";

const scroll = at == "mobile" ? { x: 1000, y: 1500 } : { };

const loading = ref(false);
const handleDelete = (record) => {
    deleteTransaction(record._id).then((res) => {
        console.log(res);
        message.success('Xóa thành công');
        getTransactionData();
    }).catch((error) => {
        console.log(error);
    });
}

const handleApprove = (record, status) => {
    updateTransaction(record._id, { status }).then((res) => {
        console.log(res);
        const message = status === 'success' ? 'Duyệt thành công' : 'Từ chối thành công';
        toast.success(message);
        socket.emit('updateTransaction', {
            transactionData: res.transactionData,
            status: status,
            userId: record.userId,
            message: status === 'success' ? 'Nạp tiền thành công' : 'Nạp tiền thất bại'
        });

        getTransactionData();
    }).catch((error) => {
        console.log(error);
    });
}


</script>

<template>
    <div class="dashboard">
        <a-row style="margin-top: 16px;">
            <a-col :span="24">
                <a-card title="Quản lý giao dịch">
                    <!-- <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" layout="vertical">
                        <a-row :gutter="16">
                            <a-col :span="6">
                                <a-form-item label="Từ ngày">
                                    <a-date-picker v-model:value="formState.fromDate" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="Đến ngày">
                                    <a-date-picker v-model:value="formState.toDate" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="Loại giao dịch">
                                    <a-select v-model:value="formState.type">
                                        <a-select-option value="all">Tất cả</a-select-option>
                                        <a-select-option value="deposit">Nạp tiền</a-select-option>
                                        <a-select-option value="withdraw">Rút tiền</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="Trạng thái">
                                    <a-select v-model:value="formState.status">
                                        <a-select-option value="all">Tất cả</a-select-option>
                                        <a-select-option value="success">Thành công</a-select-option>
                                        <a-select-option value="failed">Thất bại</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>

                    </a-form> -->
                    <a-table :columns="columns" :data-source="data" :pagination="false"
                        :locale="{ emptyText: 'Không có giao dịch nào' }" :scroll="scroll" bordered="true">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                                <a-space>
                                    <a-button type="danger" @click="handleDelete(record)">Xóa</a-button>
                                    <a-button type="success" @click="handleApprove(record, 'success')">Duyệt</a-button>
                                    <a-button type="danger" @click="handleApprove(record, 'failed')">Từ chối</a-button>
                                </a-space>
                            </template>
                            <template v-if="column.key === 'status'">
                                <a-tag v-if="record.status === 'success'" color="green">Thành công</a-tag>
                                <a-tag v-else-if="record.status === 'failed'" color="red">Thất bại</a-tag>
                                <a-tag v-else color="orange">Chờ duyệt</a-tag>
                            </template>
                        </template>
                    </a-table>
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
.ant-btn-success{
    background-color: #52c41a;
    border-color: #52c41a;
    box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
}
.ant-btn-danger{
    background-color: #f0f0f0;
    border-color: #f0f0f0;
    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
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