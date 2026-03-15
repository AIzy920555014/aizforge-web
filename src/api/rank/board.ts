import request from '@/config/axios'

export interface RankBoard {
  id?: number
  name: string
  code: string
  title: string
  subtitle?: string
  boardType: string
  themeCode: string
  showRankNo: boolean
  showIssueNo: boolean
  status: number
  remark?: string
  createTime?: string
}

export const RankBoardApi = {
  getRankBoardPage: async (params: any) => {
    return await request.get({ url: '/rank/board/page', params })
  },

  getRankBoard: async (id: number) => {
    return await request.get({ url: '/rank/board/get?id=' + id })
  },

  getRankBoardSimpleList: async () => {
    return await request.get({ url: '/rank/board/simple-list' })
  },

  createRankBoard: async (data: RankBoard) => {
    return await request.post({ url: '/rank/board/create', data })
  },

  updateRankBoard: async (data: RankBoard) => {
    return await request.put({ url: '/rank/board/update', data })
  },

  deleteRankBoard: async (id: number) => {
    return await request.delete({ url: '/rank/board/delete?id=' + id })
  }
}
