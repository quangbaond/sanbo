const user = {
    namespaced: true,
    state: {
        user: null
    },
    mutations: {
        setUser: (state, user) => {
            state.user = user;
        },
        updateUser: (state, user) => {
            state.user = { ...state.user, ...user };
        }
    }
}
export default user;