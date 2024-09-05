import { createLogger, createStore } from "vuex";
import user from "./user";
import transaction from "./transaction";
const debug = process.env.NODE_ENV !== 'production';

const logger = createLogger();

export default createStore({
    modules: {
        user,
        transaction
    },
    strict: debug,
    plugins: debug ? [logger] : []
})