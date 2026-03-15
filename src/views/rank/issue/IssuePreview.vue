<template>
  <Dialog v-model="dialogVisible" title="榜单预览" width="840px" top="5vh">
    <div class="mb-12px flex items-center justify-end gap-8px">
      <el-button @click="openPublicPage">打开公开页</el-button>
      <el-button type="primary" @click="exportImage">导出 PNG</el-button>
    </div>
    <div ref="previewRef">
      <RankPublicCard v-if="data" :data="data" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { toPng } from 'html-to-image'
import type { RankPublicBoard } from '@/api/rank/issue'
import RankPublicCard from '../components/RankPublicCard.vue'

defineOptions({ name: 'RankIssuePreview' })

const message = useMessage()

const dialogVisible = ref(false)
const data = ref<RankPublicBoard>()
const previewRef = ref<HTMLElement>()

const open = (payload: RankPublicBoard) => {
  data.value = payload
  dialogVisible.value = true
}
defineExpose({ open })

const exportImage = async () => {
  if (!previewRef.value || !data.value) {
    return
  }
  const dataUrl = await toPng(previewRef.value, {
    backgroundColor: '#ffffff',
    pixelRatio: 2
  })
  const link = document.createElement('a')
  link.download = `${data.value.boardCode}-${data.value.issueNo}.png`
  link.href = dataUrl
  link.click()
  message.success('图片已导出')
}

const openPublicPage = () => {
  if (!data.value) {
    return
  }
  window.open(`/rank-display/${data.value.boardCode}/${data.value.issueNo}`, '_blank')
}
</script>
