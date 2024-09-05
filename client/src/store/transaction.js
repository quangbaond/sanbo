const transaction = {
    namespaced: true,
    state: {
        isDone: false
    },
    mutations: {
        setIsDone: (state, isDone) => {
            state.isDone = isDone;
        }
    }
}
export default transaction;