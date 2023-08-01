import initBackendNodes from "../../../jsNodes/data/initBackend/initBackendNodes"
import subscribeNodes from "../../../jsNodes/data/subscribe/subscribeNodes"
import createNodes from "../../../jsNodes/data/create/createNodes"
import mCreateNodes from "../../../jsNodes/data/mCreate/mCreateNodes"
import updateNodes from "../../../jsNodes/data/update/updateNodes"

const nodes = [
    ...initBackendNodes, ...subscribeNodes, ...createNodes, ...mCreateNodes, ...updateNodes,
]

export default nodes