const user = {
    namespaced: true,
    state: {
        user: null
    },
    mutations: {
        setUser: (state, user) => {
            state.user = user;
        }
    }
}
export default user;