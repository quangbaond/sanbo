import { createLogger, createStore } from "vuex";
import user from "./user";
const debug = process.env.NODE_ENV !== 'production';

const logger = createLogger();

export default createStore({
    modules: {
        user
    },
    strict: debug,
    plugins: debug ? [logger] : []
})