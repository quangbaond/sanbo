<script setup>
import { ref, onMounted, computed, watch} from 'vue';
import { useStore } from 'vuex';
import { getMyTransaction } from '../services/transaction';
import moment from 'moment';
import { formatCurrency } from '../common';
const store = useStore();
const user = computed(() => store.state.user.user);
const columns = [
    {
        title: 'Mã giao dịch',
        dataIndex: 'code',
        key: 'code',
    },
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
        dataIndex: 'type',
        key: 'type',
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
        align: 'center',
        // customRender: (text) => {
        //     return text.text ? text.text?.status === 'success' ? 'Thành công' : 'Thất bại' : 'Đang chờ';
        // },

    }

]
const data = ref([]);

const query = ref({
    fromDate: null,
    toDate: null,
    type: 'all',
    status: 'all'
});

onMounted(() => {
    getTranData(query.value);
});
const getTranData = (queryData) => {
    getMyTransaction(queryData).then((res) => {
        console.log(res);
        data.value = res.transactionData?.docs;
        pagination.value = {
            current: res.transactionData?.page,
            pageSize: res.transactionData?.limit,
            total: res.transactionData?.totalDocs
        }
    });
}
const at = window.innerWidth <= 768 ? "mobile" : "pc";

const scroll = at == "mobile" ? { x: 1000, y: 700 } : { x: 0, y: 700 };

const formState = ref({
    fromDate: null,
    toDate: null,
    type: 'all',
    status: 'all'
});
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
});

const handleSubmit = (values) => {
    query.value = values;
    if(query.value.fromDate){
        query.value.fromDate = moment(query.value.fromDate).format('YYYY-MM-DD');
    }
    if(query.value.toDate){
        query.value.toDate = moment(query.value.toDate).format('YYYY-MM-DD');
    }
    getTranData(query.value);
}
watch(formState, (newVal, oldVal) => {
    console.log(newVal, oldVal);
    getTranData();
});
const handleTableChange = (pagination) => {
    pagination.value = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
    }
    getTranData({...query.value, page: pagination.current, limit: pagination.pageSize});
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
                                            <span style="font-size: 18px;">Tài khoản: <span>{{ user?.username }}</span></span>
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
                <a-card title="Giao dịch mới nhất" style="margin-top: 10px;">
                    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" layout="vertical">
                        <a-row :gutter="16">
                            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <a-form-item label="Từ ngày" name="fromDate">
                                    <a-date-picker v-model:value="formState.fromDate" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <a-form-item label="Đến ngày" name="toDate">
                                    <a-date-picker v-model:value="formState.toDate" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <a-form-item label="Loại giao dịch" name="type">
                                    <a-select v-model:value="formState.type">
                                        <a-select-option value="all">Tất cả</a-select-option>
                                        <a-select-option value="deposit">Nạp tiền</a-select-option>
                                        <a-select-option value="withdraw">Rút tiền</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <!-- // trạng thái -->
                            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <a-form-item label="Trạng thái" name="status">
                                    <a-select v-model:value="formState.status">
                                        <a-select-option value="all">Tất cả</a-select-option>
                                        <a-select-option value="success">Thành công</a-select-option>
                                        <a-select-option value="failed">Thất bại</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-form-item>
                            <a-button type="primary" html-type="submit">Tìm kiếm</a-button>
                        </a-form-item>
                    </a-form>
                    <a-table @change="handleTableChange" :columns="columns" :data-source="data" :pagination="pagination"
                        :locale="{ emptyText: 'Không có giao dịch nào' }" :scroll="scroll" bordered="true">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'status'" >
                                <a-tag :color="record.status === 'success' ? 'green' : (record.status == 'failed' ? 'red' : 'orange')">{{ record.status == 'success' ? 'Thành công' : (record.status == 'failed' ? 'Thất bại' : 'Đang chờ')  }}</a-tag>
                            </template>
                            <template v-if="column.key === 'type'">
                                <a-tag :color="record.type === 'deposit' ? 'green' : (record.type == 'withdraw' ? 'red' : 'orange')">{{ record.type == 'deposit' ? 'Nạp tiền' : (record.type == 'withdraw' ? 'Rút tiền' : 'Chuyển khoản')  }}</a-tag>
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
.ant-picker{
    width: 100%;
}
</style>