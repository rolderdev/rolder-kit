import initBackendNodes from "../../../jsNodes/data/initBackend/initBackendNodes"
import subscribeNodes from "../../../jsNodes/data/subscribe/subscribeNodes"
import createUserNodes from "../../../jsNodes/data/createUser/createUserNodes"
import mDeleteUsersNodes from "../../../jsNodes/data/mDeleteUsers/mDeleteUsersNodes"
import createNodes from "../../../jsNodes/data/create/createNodes"
import mCreateNodes from "../../../jsNodes/data/mCreate/mCreateNodes"
import updateNodes from "../../../jsNodes/data/update/updateNodes"
import mUpdateNodes from "../../../jsNodes/data/mUpdate/mUpdateNodes"
import mDeleteNodes from "../../../jsNodes/data/mDelete/mDeleteNodes"
import notificationNodes from "../../../jsNodes/notification/notificationNodes"
import uploadWebCamShotsNodes from "../../../jsNodes/data/uploadFiles/uploadWebCamShots/uploadWebCamShotsNodes"

const nodes = [
    ...initBackendNodes, ...subscribeNodes, ...createUserNodes, ...mDeleteUsersNodes, ...createNodes, ...mCreateNodes, ...updateNodes, ...mUpdateNodes,
    ...mDeleteNodes, ...notificationNodes, ...uploadWebCamShotsNodes,
]

export default nodes