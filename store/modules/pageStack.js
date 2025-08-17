const state =()=>({
  pageStack: []
})

const mutations = {
  PUSH_PAGE(state, page) {
    state.pageStack.push(page)
  },
  POP_PAGE(state) {
    state.pageStack.pop()
  },
  CLEAR_PAGE_STACK(state) {
    state.pageStack = []
  }
}

const actions = {
  pushPage({
    commit
  }, page) {
    commit('PUSH_PAGE', page)
  },
  popPage({
    commit
  }) {
    commit('POP_PAGE')
  },
  clearPageStack({
    commit
  }) {
    commit('CLEAR_PAGE_STACK')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}