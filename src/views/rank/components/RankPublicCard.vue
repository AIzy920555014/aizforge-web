<template>
  <div class="rank-public-page" :class="themeClass">
    <div class="rank-public-card">
      <div class="rank-public-header">
        <div class="rank-public-title">{{ data.title }}</div>
        <div v-if="data.showIssueNo" class="rank-public-issue">（{{ data.issueNo }}期）</div>
      </div>
      <div v-if="data.subtitle" class="rank-public-subtitle">{{ data.subtitle }}</div>
      <div class="rank-public-table">
        <div class="rank-public-row rank-public-head">
          <div v-if="data.showRankNo" class="rank-public-col rank-col-rank">排名</div>
          <div class="rank-public-col rank-col-subject">生肖</div>
          <div class="rank-public-col rank-col-amount">金额</div>
        </div>
        <div
          v-for="item in sortedItems"
          :key="`${item.rankNo}-${item.subjectName}`"
          class="rank-public-row"
        >
          <div v-if="data.showRankNo" class="rank-public-col rank-col-rank">{{ item.rankNo }}</div>
          <div class="rank-public-col rank-col-subject">
            <span class="rank-public-icon">{{ resolveIcon(item) }}</span>
            <span>{{ item.subjectName }}</span>
          </div>
          <div class="rank-public-col rank-col-amount">{{ formatAmount(item.amountValue) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RankIssueItem, RankPublicBoard } from '@/api/rank/issue'

const props = defineProps<{
  data: RankPublicBoard
}>()

const zodiacIcons: Record<string, string> = {
  鼠: '🐭',
  牛: '🐮',
  虎: '🐯',
  兔: '🐰',
  龙: '🐲',
  蛇: '🐍',
  马: '🐴',
  羊: '🐐',
  猴: '🐒',
  鸡: '🐓',
  狗: '🐕',
  猪: '🐷'
}

const themeClass = computed(() => `theme-${props.data.themeCode || 'light-default'}`)

const sortedItems = computed(() => {
  return [...(props.data.items || [])].sort((a, b) => {
    return (a.sortOrder ?? a.rankNo ?? 0) - (b.sortOrder ?? b.rankNo ?? 0)
  })
})

const resolveIcon = (item: RankIssueItem) => {
  if (item.iconUrl) {
    return '🟢'
  }
  return zodiacIcons[item.subjectName] || '⭐'
}

const formatAmount = (value: string | number) => {
  const amount = Number(value)
  if (Number.isNaN(amount)) {
    return value
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}
</script>

<style scoped lang="scss">
.rank-public-page {
  min-height: 100%;
  padding: 16px;
  background:
    radial-gradient(circle at top left, rgba(255, 244, 207, 0.85), transparent 35%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.rank-public-card {
  max-width: 760px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.rank-public-header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 22px 20px 6px;
  color: #111827;
}

.rank-public-title {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
}

.rank-public-issue {
  font-size: 26px;
  font-weight: 700;
}

.rank-public-subtitle {
  padding: 0 20px 10px;
  color: #64748b;
  font-size: 14px;
}

.rank-public-table {
  width: 100%;
}

.rank-public-row {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) minmax(180px, 220px);
  align-items: center;
  min-height: 68px;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.rank-public-head {
  min-height: 54px;
  color: #475569;
  font-size: 15px;
  font-weight: 700;
}

.rank-public-col {
  padding: 0 20px;
}

.rank-col-rank {
  text-align: center;
}

.rank-col-subject {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #111827;
  font-size: 22px;
  font-weight: 600;
}

.rank-col-amount {
  color: #111827;
  font-size: 24px;
  font-weight: 600;
  text-align: right;
}

.rank-public-icon {
  font-size: 24px;
}

@media (max-width: 768px) {
  .rank-public-page {
    padding: 12px;
  }

  .rank-public-card {
    border-radius: 18px;
  }

  .rank-public-header {
    display: block;
    padding: 18px 16px 8px;
  }

  .rank-public-title {
    font-size: 18px;
  }

  .rank-public-issue {
    display: inline-block;
    margin-top: 4px;
    font-size: 16px;
  }

  .rank-public-subtitle {
    padding: 0 16px 8px;
    font-size: 12px;
  }

  .rank-public-row {
    grid-template-columns: 56px minmax(0, 1fr) minmax(110px, 140px);
    min-height: 54px;
  }

  .rank-public-col {
    padding: 0 12px;
  }

  .rank-col-subject {
    gap: 8px;
    font-size: 16px;
  }

  .rank-col-amount {
    font-size: 17px;
  }

  .rank-public-icon {
    font-size: 18px;
  }
}
</style>
