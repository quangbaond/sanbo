<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import { formatCurrency } from '@/common';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { getStaticFile } from '@/common';
import { message } from 'ant-design-vue';
import { addBank, deleteBank } from '@/services/bank';
import { getBanks, updateBank } from '../../services/bank';
const store = useStore();
const user = computed(() => store.state.user.user);
const columns = [

    {
        title: 'Tên ngân hàng',
        dataIndex: 'bankName',
        key: 'bankName',
        customRender: (text) => {
            return text.text;
        }
    },
    {
        title: 'Số tài khoản',
        dataIndex: 'bankNumberAccount',
        key: 'bankNumberAccount',
        customRender: (text) => {
            console.log(text);
            return text.text;
        }
    },
    {
        title: 'Tên chủ tài khoản',
        dataIndex: 'bankNameAccount',
        key: 'bankNameAccount',
        customRender: (text) => {
            return text.text;
        }
    },
    {
        title: 'Chi nhánh',
        dataIndex: 'bankBranch',
        key: 'bankBranch',
    },
    {
        title: 'Ảnh',
        dataIndex: 'image',
        key: 'image',
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
    getBankData();
});
const getBankData = () => {
    getBanks().then((res) => {
        data.value = res.banks;
    }).catch((error) => {
        console.log(error);
    });
}
const at = window.innerWidth <= 768 ? "mobile" : "pc";

const scroll = at == "mobile" ? { x: 1500, y: 1500 } : { x: 1000, y: 1000 };

const bankData = ref([]);
const visible = ref(false);
const formRef = ref(null);
const formAdd = ref({
    bankName: '',
    bankAccountNumber: '',
    accountName: '',
    bankBranch: '',
    image: ''
});

const handleAdd = () => {
    visible.value = true;
    console.log(visible.value);
}
const handleOk = () => {

    formRef.value.validateFields().then((values) => {
        if(!formAdd.value.image){
            message.error('Vui lòng chọn ảnh');
            return;
        }
        loading.value = true;

        addBank(formAdd.value).then((res) => {
            console.log(res);
            message.success('Thêm thành công');
            visible.value = false;
            formAdd.value = {
                bankName: '',
                bankAccountNumber: '',
                accountName: '',
                bankBranch: '',
                image: ''
            };
            formEdit.value = formAdd.value;
            fileList.value = [];
            getBankData();
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            loading.value = false;
        });
    }).catch((error) => {
        console.log(error);
    });
}

const fileList = ref([]);
const handleChange = (info) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        console.log(info.file.response);
        formAdd.value.image = info.file.response.url;
        formEdit.value.image = info.file.response.url;
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
}
const urlUpload = import.meta.env.VITE_API_UPLOAD_URL || 'http://localhost:3000/upload';
const loading = ref(false);
const handleDelete = (record) => {
    deleteBank(record._id).then((res) => {
        console.log(res);
        message.success('Xóa thành công');
        getBankData();
    }).catch((error) => {
        console.log(error);
    });
}

const visibleEdit = ref(false);
const formEdit = ref({
    bankName: '',
    bankNumberAccount: '',
    bankNameAccount: '',
    bankBranch: '',
    image: ''
});
const loadingEdit = ref(false);

const handleEdit = (record) => {
    visibleEdit.value = true;
    formEdit.value = record;
    fileList.value = [];
}
const formEditRef = ref(null);
const handleEditOk = () => {
    formEditRef.value.validateFields().then((values) => {
        if(!formEdit.value.image){
            message.error('Vui lòng chọn ảnh');
            return;
        }
        loadingEdit.value = true;
        updateBank(formEdit.value._id, formEdit.value).then((res) => {
            message.success('Cập nhật thành công');
            getBankData();
            visibleEdit.value = false;
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            loadingEdit.value = false;
        });
    }).catch((error) => {
        console.log(error);
    });
}




</script>

<template>
    <div class="dashboard">
        <a-row style="margin-top: 16px;">
            <a-col :span="24">
                <a-card title="Quản lý ngân hàng">
                    <template #extra>
                        <a-button type="primary" @click="handleAdd">
                            <PlusOutlined />
                            Thêm
                        </a-button>
                    </template>
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
                        :locale="{ emptyText: 'Không có ngân hàng nào' }" :scroll="scroll" bordered="true">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                                <a-space>
                                    <a-button type="primary" @click="handleEdit(record)">Sửa</a-button>
                                    <a-button type="danger" @click="handleDelete(record)">Xóa</a-button>
                                </a-space>
                            </template>
                            <template v-if="column.key === 'image'">
                                <a-image :src="getStaticFile(record.image)" alt="avatar" style="width: 100%; height: 100%;" />
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </a-col>
        </a-row>
    </div>
    <a-modal v-model:visible="visible" title="Thêm mới ngân hàng" @ok="handleOk" okText="Thêm mới" cancelText="Hủy" :confirm-loading="loading">
        <a-form ref="formRef" :model="formAdd" name="basic" autocomplete="off" layout="vertical">
            <a-form-item label="Tên ngân hàng" name="bankName"
                :rules="[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]">
                <a-input v-model:value="formAdd.bankName" />
            </a-form-item>
            <a-form-item label="Số tài khoản" name="bankNumberAccount"
                :rules="[{ required: true, message: 'Vui lòng nhập số tài khoản' }]">
                <a-input v-model:value="formAdd.bankNumberAccount" />
            </a-form-item>
            <a-form-item label="Tên chủ tài khoản" name="bankNameAccount"
                :rules="[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]">
                <a-input v-model:value="formAdd.bankNameAccount" />
            </a-form-item>
            <a-form-item label="Chi nhánh" name="bankBranch"
                :rules="[{ required: true, message: 'Vui lòng nhập chi nhánh' }]">
                <a-input v-model:value="formAdd.bankBranch" />
            </a-form-item>
            <a-upload v-model:file-list="fileList" name="file" :multiple="false" :action="urlUpload" @change="handleChange" list-type="picture-card" :show-upload-list="false">
                <img v-if="formAdd.image" :src="getStaticFile(formAdd.image)" alt="avatar" style="width: 100%; height: 100%;" />
                <div v-else>
                    <loading-outlined v-if="loading"></loading-outlined>
                    <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div>
            </div>
            </a-upload>
        </a-form>
    </a-modal>
    <!-- // modal edit -->
    <a-modal v-model:visible="visibleEdit" title="Sửa ngân hàng" @ok="handleEditOk" okText="Sửa" cancelText="Hủy" :confirm-loading="loadingEdit">
        <a-form ref="formEditRef" :model="formEdit" name="basic" autocomplete="off" layout="vertical">
            <a-form-item label="Tên ngân hàng" name="bankName"
                :rules="[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]">
                <a-input v-model:value="formEdit.bankName" />
            </a-form-item>
            <a-form-item label="Số tài khoản" name="bankNumberAccount"
                :rules="[{ required: true, message: 'Vui lòng nhập số tài khoản' }]">
                <a-input v-model:value="formEdit.bankNumberAccount" />
            </a-form-item>
            <a-form-item label="Tên chủ tài khoản" name="bankNameAccount"
                :rules="[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]">
                <a-input v-model:value="formEdit.bankNameAccount" />
            </a-form-item>
            <a-form-item label="Chi nhánh" name="bankBranch"
                :rules="[{ required: true, message: 'Vui lòng nhập chi nhánh' }]">
                <a-input v-model:value="formEdit.bankBranch" />
            </a-form-item>
            <a-form-item label="Ảnh" name="image"
                :rules="[{ required: true, message: 'Vui lòng chọn ảnh' }]">
                <a-upload v-model:file-list="fileList" name="file" :multiple="false" :action="urlUpload" @change="handleChange" list-type="picture-card" :show-upload-list="false">
                    <img v-if="formEdit.image" :src="getStaticFile(formEdit.image)" alt="avatar" style="width: 100%; height: 100%;" />
                    <div v-else>
                        <loading-outlined v-if="loading"></loading-outlined>
                        <plus-outlined v-else></plus-outlined>
                        <div class="ant-upload-text">Upload</div>
                    </div>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-modal>
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