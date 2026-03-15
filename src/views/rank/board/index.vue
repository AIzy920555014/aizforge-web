<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :inline="true"
      :model="queryParams"
      label-width="80px"
    >
      <el-form-item label="榜单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入榜单名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="榜单编码" prop="code">
        <el-input
          v-model="queryParams.code"
          class="!w-240px"
          clearable
          placeholder="请输入榜单编码"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-180px" clearable placeholder="全部状态">
          <el-option label="启用" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          v-hasPermi="['rank:board:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增榜单
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="90" />
      <el-table-column label="榜单名称" align="center" prop="name" min-width="180" />
      <el-table-column label="榜单编码" align="center" prop="code" min-width="150" />
      <el-table-column label="页面标题" align="center" prop="title" min-width="220" />
      <el-table-column label="状态" align="center" width="90">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'info'">
            {{ scope.row.status === 0 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="主题" align="center" prop="themeCode" width="140" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createTime as Date) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="220" fixed="right">
        <template #default="scope">
          <el-button
            v-hasPermi="['rank:board:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button link type="success" @click="openPublic(scope.row.code)">公开页</el-button>
          <el-button
            v-hasPermi="['rank:board:delete']"
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

  <BoardForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
import { RankBoardApi, type RankBoard } from '@/api/rank/board'
import BoardForm from './BoardForm.vue'

defineOptions({ name: 'RankBoard' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(false)
const list = ref<RankBoard[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  code: undefined,
  status: undefined
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await RankBoardApi.getRankBoardPage(queryParams)
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
    await RankBoardApi.deleteRankBoard(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const openPublic = (boardCode: string) => {
  window.open(`/rank-display/${boardCode}`, '_blank')
}

onMounted(() => {
  getList()
})
</script>
