<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :inline="true"
      :model="queryParams"
      label-width="80px"
    >
      <el-form-item label="所属榜单" prop="boardId">
        <el-select
          v-model="queryParams.boardId"
          class="!w-220px"
          clearable
          filterable
          placeholder="全部榜单"
        >
          <el-option
            v-for="board in boardOptions"
            :key="board.id"
            :label="board.name"
            :value="board.id!"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="期号" prop="issueNo">
        <el-input
          v-model="queryParams.issueNo"
          class="!w-220px"
          clearable
          placeholder="请输入期号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-180px" clearable placeholder="全部状态">
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
          <el-option label="已下线" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          v-hasPermi="['rank:issue:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增期次
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="90" />
      <el-table-column label="所属榜单" align="center" min-width="180">
        <template #default="scope">
          {{ scope.row.boardName || boardMap[scope.row.boardId] || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="期号" align="center" prop="issueNo" width="140" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag :type="statusTagType[scope.row.status || 0]">
            {{ statusLabel[scope.row.status || 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.publishTime as Date) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createTime as Date) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="360" fixed="right">
        <template #default="scope">
          <el-button
            v-hasPermi="['rank:issue:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-hasPermi="['rank:issue:update']"
            link
            type="warning"
            @click="handleCopyLast(scope.row.id)"
          >
            复制上一期
          </el-button>
          <el-button
            v-if="scope.row.status !== 1"
            v-hasPermi="['rank:issue:update']"
            link
            type="success"
            @click="handlePublish(scope.row.id)"
          >
            发布
          </el-button>
          <el-button
            v-if="scope.row.status === 1"
            v-hasPermi="['rank:issue:update']"
            link
            type="info"
            @click="handleOffline(scope.row.id)"
          >
            下线
          </el-button>
          <el-button link type="primary" @click="handlePreview(scope.row.id)">预览</el-button>
          <el-button link type="success" @click="openPublic(scope.row)">公开页</el-button>
          <el-button
            v-hasPermi="['rank:issue:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <IssueForm ref="formRef" @success="getList" />
  <IssuePreview ref="previewRef" />
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
import { RankBoardApi, type RankBoard } from '@/api/rank/board'
import { RankIssueApi, type RankIssue } from '@/api/rank/issue'
import IssueForm from './IssueForm.vue'
import IssuePreview from './IssuePreview.vue'

defineOptions({ name: 'RankIssue' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(false)
const list = ref<RankIssue[]>([])
const total = ref(0)
const boardOptions = ref<RankBoard[]>([])
const boardMap = reactive<Record<number, string>>({})
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  boardId: undefined,
  issueNo: undefined,
  status: undefined
})
const queryFormRef = ref()

const statusLabel: Record<number, string> = {
  0: '草稿',
  1: '已发布',
  2: '已下线'
}

const statusTagType: Record<number, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
  0: 'warning',
  1: 'success',
  2: 'info'
}

const loadBoards = async () => {
  boardOptions.value = await RankBoardApi.getRankBoardSimpleList()
  Object.keys(boardMap).forEach((key) => delete boardMap[Number(key)])
  boardOptions.value.forEach((board) => {
    if (board.id) {
      boardMap[board.id] = board.name
    }
  })
}

const getList = async () => {
  loading.value = true
  try {
    const data = await RankIssueApi.getRankIssuePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await RankIssueApi.deleteRankIssue(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleCopyLast = async (id: number) => {
  try {
    await RankIssueApi.copyLastIssue(id)
    message.success('已复制上一期数据')
    await getList()
  } catch {}
}

const handlePublish = async (id: number) => {
  try {
    await RankIssueApi.publishIssue(id)
    message.success('发布成功')
    await getList()
  } catch {}
}

const handleOffline = async (id: number) => {
  try {
    await RankIssueApi.offlineIssue(id)
    message.success('已下线')
    await getList()
  } catch {}
}

const previewRef = ref()
const handlePreview = async (id: number) => {
  const data = await RankIssueApi.previewIssue(id)
  previewRef.value.open(data)
}

const openPublic = (row: RankIssue) => {
  if (!row.boardCode) {
    message.warning('缺少榜单编码，无法打开公开页')
    return
  }
  window.open(`/rank-display/${row.boardCode}/${row.issueNo}`, '_blank')
}

onMounted(async () => {
  await loadBoards()
  await getList()
})
</script>
