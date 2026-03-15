<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080px" top="5vh">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="所属榜单" prop="boardId">
            <el-select v-model="formData.boardId" class="w-full" filterable placeholder="请选择榜单">
              <el-option
                v-for="board in boardOptions"
                :key="board.id"
                :label="board.name"
                :value="board.id!"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="期号" prop="issueNo">
            <el-input v-model="formData.issueNo" placeholder="例如 2026073" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="可选" />
      </el-form-item>
    </el-form>

    <div class="mb-12px flex items-center justify-between">
      <div class="text-[14px] font-600 text-[#334155]">榜单明细</div>
      <div class="flex gap-8px">
        <el-button @click="fillZodiacTemplate">填充生肖模板</el-button>
        <el-button type="primary" plain @click="addItem">新增一行</el-button>
      </div>
    </div>

    <el-table :data="formData.items" border>
      <el-table-column label="排名" width="90">
        <template #default="scope">
          <el-input-number v-model="scope.row.rankNo" :min="1" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column label="对象名称" min-width="120">
        <template #default="scope">
          <el-input v-model="scope.row.subjectName" placeholder="例如 蛇" />
        </template>
      </el-table-column>
      <el-table-column label="对象编码" min-width="120">
        <template #default="scope">
          <el-input v-model="scope.row.subjectCode" placeholder="可选" />
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="150">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.amountValue"
            :min="0"
            :precision="2"
            controls-position="right"
            class="!w-full"
          />
        </template>
      </el-table-column>
      <el-table-column label="展示文案" min-width="130">
        <template #default="scope">
          <el-input v-model="scope.row.displayText" placeholder="可选" />
        </template>
      </el-table-column>
      <el-table-column label="排序号" width="100">
        <template #default="scope">
          <el-input-number v-model="scope.row.sortOrder" :min="1" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="scope">
          <el-button link type="danger" @click="removeItem(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button type="primary" :disabled="formLoading" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { RankBoardApi, type RankBoard } from '@/api/rank/board'
import { RankIssueApi, type RankIssue, type RankIssueItem } from '@/api/rank/issue'

defineOptions({ name: 'RankIssueForm' })

const { t } = useI18n()
const message = useMessage()

const zodiacNames = ['蛇', '马', '猴', '龙', '狗', '羊', '鸡', '牛', '猪', '鼠', '虎', '兔']

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('create')
const formRef = ref()
const boardOptions = ref<RankBoard[]>([])

const createEmptyItem = (index = 1): RankIssueItem => ({
  rankNo: index,
  subjectName: '',
  subjectCode: '',
  amountValue: 0,
  displayText: '',
  sortOrder: index,
  remark: ''
})

const createDefaultForm = (): RankIssue => ({
  boardId: undefined as unknown as number,
  issueNo: '',
  remark: '',
  items: [createEmptyItem()]
})

const formData = ref<RankIssue>(createDefaultForm())

const formRules = reactive({
  boardId: [{ required: true, message: '所属榜单不能为空', trigger: 'change' }],
  issueNo: [{ required: true, message: '期号不能为空', trigger: 'blur' }]
})

const loadBoardOptions = async () => {
  boardOptions.value = await RankBoardApi.getRankBoardSimpleList()
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await loadBoardOptions()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RankIssueApi.getRankIssue(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])

const submitForm = async () => {
  await formRef.value.validate()
  if (!formData.value.items.length) {
    message.warning('请至少维护一条榜单明细')
    return
  }
  if (formData.value.items.some((item) => !item.subjectName)) {
    message.warning('请补全对象名称')
    return
  }
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await RankIssueApi.createRankIssue(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await RankIssueApi.updateRankIssue(formData.value)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const addItem = () => {
  formData.value.items.push(createEmptyItem(formData.value.items.length + 1))
}

const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const fillZodiacTemplate = () => {
  formData.value.items = zodiacNames.map((name, index) => ({
    rankNo: index + 1,
    subjectName: name,
    subjectCode: name,
    amountValue: 0,
    displayText: '',
    sortOrder: index + 1,
    remark: ''
  }))
}

const resetForm = () => {
  formData.value = createDefaultForm()
  formRef.value?.resetFields()
}
</script>
