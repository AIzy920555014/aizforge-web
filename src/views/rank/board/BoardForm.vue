<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="720px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="榜单名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入榜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="榜单编码" prop="code">
            <el-input v-model="formData.code" placeholder="例如 pt-hot" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="页面标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入页面标题" />
      </el-form-item>
      <el-form-item label="页面副标题" prop="subtitle">
        <el-input v-model="formData.subtitle" placeholder="可选" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="榜单类型" prop="boardType">
            <el-input v-model="formData.boardType" placeholder="ranking" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主题编码" prop="themeCode">
            <el-input v-model="formData.themeCode" placeholder="light-default" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="显示排名" prop="showRankNo">
            <el-switch v-model="formData.showRankNo" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="显示期号" prop="showIssueNo">
            <el-switch v-model="formData.showIssueNo" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :value="0">启用</el-radio>
              <el-radio :value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="可选" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :disabled="formLoading" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { RankBoardApi, type RankBoard } from '@/api/rank/board'

defineOptions({ name: 'RankBoardForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('create')
const formRef = ref()
const formData = ref<RankBoard>({
  name: '',
  code: '',
  title: '',
  subtitle: '',
  boardType: 'ranking',
  themeCode: 'light-default',
  showRankNo: true,
  showIssueNo: true,
  status: 0,
  remark: ''
})

const formRules = reactive({
  name: [{ required: true, message: '榜单名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '榜单编码不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '页面标题不能为空', trigger: 'blur' }],
  boardType: [{ required: true, message: '榜单类型不能为空', trigger: 'blur' }],
  themeCode: [{ required: true, message: '主题编码不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
})

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RankBoardApi.getRankBoard(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])

const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await RankBoardApi.createRankBoard(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await RankBoardApi.updateRankBoard(formData.value)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    code: '',
    title: '',
    subtitle: '',
    boardType: 'ranking',
    themeCode: 'light-default',
    showRankNo: true,
    showIssueNo: true,
    status: 0,
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
