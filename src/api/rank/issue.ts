import request from '@/config/axios'

export interface RankIssueItem {
  id?: number
  rankNo: number
  subjectCode?: string
  subjectName: string
  iconUrl?: string
  amountValue: number | string
  displayText?: string
  sortOrder: number
  remark?: string
}

export interface RankIssue {
  id?: number
  boardId: number
  boardName?: string
  boardCode?: string
  issueNo: string
  publishTime?: string
  status?: number
  snapshotTitle?: string
  snapshotSubtitle?: string
  sortVersion?: number
  remark?: string
  createTime?: string
  items: RankIssueItem[]
}

export interface RankPublicBoard {
  boardId: number
  boardName: string
  boardCode: string
  title: string
  subtitle?: string
  issueNo: string
  publishTime?: string
  themeCode: string
  showRankNo: boolean
  showIssueNo: boolean
  items: RankIssueItem[]
}

export const RankIssueApi = {
  getRankIssuePage: async (params: any) => {
    return await request.get({ url: '/rank/issue/page', params })
  },

  getRankIssue: async (id: number) => {
    return await request.get({ url: '/rank/issue/get?id=' + id })
  },

  createRankIssue: async (data: RankIssue) => {
    return await request.post({ url: '/rank/issue/create', data })
  },

  updateRankIssue: async (data: RankIssue) => {
    return await request.put({ url: '/rank/issue/update', data })
  },

  deleteRankIssue: async (id: number) => {
    return await request.delete({ url: '/rank/issue/delete?id=' + id })
  },

  copyLastIssue: async (id: number) => {
    return await request.post({ url: `/rank/issue/${id}/copy-last` })
  },

  publishIssue: async (id: number) => {
    return await request.post({ url: `/rank/issue/${id}/publish` })
  },

  offlineIssue: async (id: number) => {
    return await request.post({ url: `/rank/issue/${id}/offline` })
  },

  previewIssue: async (id: number) => {
    return await request.get({ url: `/rank/issue/${id}/preview` })
  },

  getPublicCurrent: async (boardCode: string) => {
    return await request.get({
      url: `${import.meta.env.VITE_BASE_URL}/app-api/rank/public/board/${boardCode}`
    })
  },

  getPublicHistory: async (boardCode: string, issueNo: string) => {
    return await request.get({
      url: `${import.meta.env.VITE_BASE_URL}/app-api/rank/public/board/${boardCode}/${issueNo}`
    })
  }
}
