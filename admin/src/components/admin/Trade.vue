<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { getTradeData } from '@/services/trade';
import moment from 'moment';
import { formatDateTime } from '@/common';
const store = useStore();
const user = computed(() => store.state.user.user);
import { socket } from '@/socket';
import { getRoomActive } from '@/services/room';
import { getSymbolActive } from '@/services/binance';
import { getSessionBefore } from '@/services/session';
import { useToast } from 'vue-toast-notification';
import { updateBinance } from '@/services/binance';
import { formatterNumber, parserNumber } from '@/common';

const toast = useToast();
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
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Thời gian bắt đầu',
        dataIndex: 'timeStart',
        key: 'timeStart',
        customRender: (text) => {
            return formatDateTime(text.text);
        }
    },
    {
        title: 'Thời gian kết thúc',
        dataIndex: 'timeEnd',
        customRender: (text) => {
            return formatDateTime(text.text);
        }
    },
    {
        title: 'Giá mở cửa',
        dataIndex: 'binanceData',
        key: 'binanceData',
        customRender: (text) => {
            return text.text?.open ? text.text.open.toFixed(2) : text.text.close.toFixed(2);
        }
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        align: 'center'
    }

]
const data = ref([]);
const roomData = ref([]);

const optionRoom = ref([]);

const query = ref({
    room: null,
    symbolName: null,
    page: 1,
    limit: 10
});
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
});

onMounted(() => {
    getRoomActive().then((res) => {
        console.log(res);
        roomData.value = res.roomData;
        optionRoom.value = roomData.value.map((item) => {
            return {
                value: item.time,
                label: item.name
            }
        });
        getSymbolActive().then((res) => {
            symbolData.value = res.data;
            symbolActive.value = symbolData.value[0].name;
            query.value = {
                room: roomData.value[0].time,
                symbolName: symbolData.value[0].name,
                page: 1,
                limit: 10
            }
            getSessionData(query.value);
        });
    });

    // socket.on('getSessionData', (res) => {
    //     data.value = res.sessionData;
    // })

});
const getSessionData = (dataQuery) => {
    const queryData = {
        ...query.value,
        ...dataQuery
    }
    getSessionBefore(queryData).then((res) => {
        console.log(res);
        data.value = res.docs;
        pagination.value = {
            current: res.page,
            pageSize: res.limit,
            total: res.totalDocs
        }
        toast.success('Lấy dữ liệu thành công');
    }).catch((error) => {
        toast.error('Lấy dữ liệu thất bại');
    });
}
const symbolData = ref([]);
socket.on('getSessionData', (res) => {
    console.log(res);
    data.value = res.sessionData;
});
const at = window.innerWidth <= 768 ? "mobile" : "pc";

const scroll = at == "mobile" ? { x: 1000, y: 700 } : {};
const form = ref({
    room: null
});
const formEdit = ref({
    focreResult: null
});
const symbolActive = ref(null);
watch(roomData, (newVal, oldVal) => {
    form.value.room = roomData.value[0].time;
    query.value.room = roomData.value[0].time;
});
watch(symbolData, (newVal, oldVal) => {
    symbolActive.value = symbolData.value[0].name;
});
const handleTableChange = (pagination) => {
    const queryData = {
        page: pagination.current,
        limit: pagination.pageSize
    }
    getSessionData(queryData);
}
watch(symbolActive, (newVal, oldVal) => {
    query.value.symbolName = newVal;
    getSessionData({
        symbolName: newVal
    });
});

const handleChangeRoom = (value) => {
    query.value.room = value;
    getSessionData({
        room: value
    });
}
const handleEdit = (record) => {
    formEdit.value.open = record.binanceData.open;
    formEdit.value.id = record.binanceData._id;
    visible.value = true;
}
const visible = ref(false);
const handleOk = () => {
    updateBinance(formEdit.value.id, formEdit.value).then((res) => {
        console.log(res);
        toast.success('Cập nhật thành công');
    }).catch((error) => {
        toast.error('Cập nhật thất bại');
    });
    visible.value = false;
}
</script>

<template>
    <h1>Trung tâm hội viên</h1>
    <div class="dashboard">
        <a-row style="margin-top: 16px;">
            <a-col :span="24">
                <a-card title="Giao dịch mới nhất">
                    <a-form layout="vertical" style="margin-bottom: 16px;">
                        <p>Loại giao dịch</p>
                        <a-select style="width: 100%;" v-model:value="form.room" :options="optionRoom"
                            @change="handleChangeRoom" />
                    </a-form>
                    <a-row>
                        <a-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4" v-for="item in symbolData" :key="item.id"
                            style="margin-bottom: 10px;">
                            <a-tag class="symbol-tag" style="margin-right: 10px;"
                                :class="{ 'active': item.name === symbolActive }" @click="symbolActive = item.name">{{
                                item.name }}</a-tag>
                        </a-col>
                    </a-row>
                    <a-table @change="handleTableChange" :columns="columns" :data-source="data" :pagination="pagination"
                        :locale="{ emptyText: 'Không có phiên giao dịch nào' }" :scroll="scroll" bordered="true">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                                <a-button type="primary" @click="handleEdit(record)">Chỉnh sửa</a-button>
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </a-col>
        </a-row>
    </div>
    <a-modal :open="visible" title="Chỉnh sửa phiên giao dịch" @ok="handleOk" okText="Lưu" cancelText="Hủy">
        <a-form layout="vertical" style="margin-bottom: 16px;" :model="formEdit" >
            <a-form-item label="Giá mở cửa">
                <a-input-number style="width: 100%;" v-model:value="formEdit.open" :disabled="true" />
            </a-form-item>
            <a-form-item label="Giá đóng cửa" :rules="[{ required: true, message: 'Vui lòng nhập giá đóng cửa' }]" name="focreResult">
                <a-input-number :formatter="formatterNumber" :parser="parserNumber" style="width: 100%;" v-model:value="formEdit.focreResult" />
            </a-form-item>
            <span style="display: block;">Mua vào: Sửa giá đóng cửa nhỏ hơn giá mở cửa </span>
            <span style="display: block;">Bán ra: Sửa giá đóng cửa lớn hơn giá mở cửa </span>
        </a-form>
    </a-modal>
</template>

<style>
.card-info {
    background-image: url(@/assets/img/card-bg.jpg);
    background-size: cover;
    background-position: center;
}

.symbol-tag {
    cursor: pointer;
}

.active {
    background-color: #1554c2;
    color: #fff;
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