import { JsNodes } from "../../../types/custom-types";
import { jsProps } from "./props";

const jsNodes: JsNodes = {
    initBackend: {
        '0.2.0': {
            nodeImport: import('../../../jsNodes/data/initBackend/initBackend_v0.2.0'),
            outputs: (({ jwtValidationFailed, jwtValidationSucceed }) => ({ jwtValidationFailed, jwtValidationSucceed }))({ ...jsProps }),
        },
    },
    subscribe: {
        '0.2.0': {
            nodeImport: import('../../../jsNodes/data/subscribe/subscribe_v0.2.0'),
        },
    },
}

export default jsNodes