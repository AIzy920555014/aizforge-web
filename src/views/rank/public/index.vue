<template>
  <div class="rank-display-page">
    <div class="rank-display-toolbar">
      <el-button @click="reloadPage">
        <Icon icon="ep:refresh" class="mr-4px" />
        刷新
      </el-button>
      <el-button type="primary" :loading="exportLoading" @click="exportImage">
        <Icon icon="ep:download" class="mr-4px" />
        导出 PNG
      </el-button>
    </div>

    <div v-loading="loading" ref="captureRef">
      <RankPublicCard v-if="data" :data="data" />
      <el-empty v-else description="暂无可展示内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toPng } from 'html-to-image'
import { RankIssueApi, type RankPublicBoard } from '@/api/rank/issue'
import RankPublicCard from '../components/RankPublicCard.vue'

defineOptions({ name: 'RankDisplayPage' })

const route = useRoute()
const message = useMessage()

const loading = ref(false)
const exportLoading = ref(false)
const data = ref<RankPublicBoard>()
const captureRef = ref<HTMLElement>()

const loadData = async () => {
  loading.value = true
  try {
    const boardCode = route.params.boardCode as string
    const issueNo = route.params.issueNo as string | undefined
    data.value = issueNo
      ? await RankIssueApi.getPublicHistory(boardCode, issueNo)
      : await RankIssueApi.getPublicCurrent(boardCode)
  } finally {
    loading.value = false
  }
}

const exportImage = async () => {
  if (!captureRef.value || !data.value) {
    return
  }
  exportLoading.value = true
  try {
    const dataUrl = await toPng(captureRef.value, {
      backgroundColor: '#ffffff',
      pixelRatio: 2
    })
    const link = document.createElement('a')
    link.download = `${data.value.boardCode}-${data.value.issueNo}.png`
    link.href = dataUrl
    link.click()
    message.success('图片已导出')
  } finally {
    exportLoading.value = false
  }
}

const reloadPage = () => {
  loadData()
}

watch(
  () => route.fullPath,
  () => {
    loadData()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.rank-display-page {
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(180deg, #fff7ed 0%, #f8fafc 100%);
}

.rank-display-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  max-width: 760px;
  margin: 0 auto 12px;
}

@media (max-width: 768px) {
  .rank-display-page {
    padding: 10px;
  }

  .rank-display-toolbar {
    justify-content: stretch;
  }
}
</style>
