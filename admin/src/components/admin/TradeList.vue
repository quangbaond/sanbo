<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import { formatCurrency, formatDateTime } from '@/common';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { getTradeListData } from '@/services/trade';
const store = useStore();
const user = computed(() => store.state.user.user);
const columns = [

    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: (text) => {
            return formatDateTime(text.text);
        }
    },
    {
        title: 'Tài khoản',
        dataIndex: 'user',
        key: 'user',
        customRender: (text) => {
            return text.text ? text.text.username : '-';
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
        title: 'Lãi/Lỗ',
        dataIndex: 'profit',
        key: 'profit',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },

]
const data = ref([]);

onMounted(() => {
    getTradeList({});
});
const getTradeList = (dataQuery) => {
    getTradeListData(dataQuery).then((res) => {
        data.value = res.tradeData.docs;
    }).catch((error) => {
        console.log(error);
    });

}
const at = window.innerWidth <= 768 ? "mobile" : "pc";

const scroll = at == "mobile" ? { x: 1500, y: 1500 } : { x: 1000, y: 1000 };
const pagination = {
    pageSize: 10,
    current: 1,
    total: 0,
}
const handleTableChange = (pagination) => {
    getTradeList({
        page: pagination.current,
        limit: pagination.pageSize
    });
}


</script>

<template>
    <div class="dashboard">
        <a-row style="margin-top: 16px;">
            <a-col :span="24">
                <a-card title="Danh sách lệnh">
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
                    <a-table :columns="columns" :data-source="data" :pagination="pagination"
                        :locale="{ emptyText: 'Không có lệnh nào' }" :scroll="scroll" bordered="true"
                        @change="handleTableChange">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'status'">
                                <a-tag :color="record.status === 'success' ? 'green' : record.status === 'failed' ? 'red' : 'warning'">
                                    {{ record.status === 'success' ? 'Thành công' : record.status === 'failed' ? 'Thất bại' : 'Đang xử lý' }}
                                </a-tag>
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
</style>