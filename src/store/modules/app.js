
const app = {
    state: {
        esri: null
    },
    mutations: {
        INIT_ESRI_MAP (state, esri) {
            state.esri = esri
        }
    },
    actions: {
        InitEsriMap ({ commit }, esri) {
            commit('INIT_ESRI_MAP', esri)
        }
    }
}
export default app