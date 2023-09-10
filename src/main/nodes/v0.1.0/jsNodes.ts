import initBackendNodes from "../../../jsNodes/data/initBackend/initBackendNodes"
import subscribeNodes from "../../../jsNodes/data/subscribe/subscribeNodes"
import createUserNodes from "../../../jsNodes/data/createUser/createUserNodes"
import updateUserNode_v0 from "../../../jsNodes/data/updateUser/v0/updateUserNode"
import mUpdateUserNode_v0 from "../../../jsNodes/data/mUpdateUser/v0/mUpdateUserNode"
import mDeleteUsersNodes from "../../../jsNodes/data/mDeleteUsers/mDeleteUsersNodes"
import createNodes from "../../../jsNodes/data/create/createNodes"
import mCreateNodes from "../../../jsNodes/data/mCreate/mCreateNodes"
import sCreateNode_v0 from "../../../jsNodes/data/sCreate/v0/sCreateNode"
import updateNodes from "../../../jsNodes/data/update/updateNodes"
import sUpdateNode_v0 from "../../../jsNodes/data/sUpdate/v0/sUpdateNode"
import mUpdateNodes from "../../../jsNodes/data/mUpdate/mUpdateNodes"
import mDeleteNodes from "../../../jsNodes/data/mDelete/mDeleteNodes"
import notificationNodes from "../../../jsNodes/notification/notificationNodes"
import uploadWebCamShotsNodes from "../../../jsNodes/data/uploadFiles/uploadWebCamShots/uploadWebCamShotsNodes"

const nodes = [
    ...initBackendNodes, ...subscribeNodes, ...createUserNodes, updateUserNode_v0, mUpdateUserNode_v0, ...mDeleteUsersNodes,
    ...createNodes, ...mCreateNodes, sCreateNode_v0, ...updateNodes, sUpdateNode_v0, ...mUpdateNodes, ...mDeleteNodes, ...notificationNodes,
    ...uploadWebCamShotsNodes,
]

export default nodes