import initBackendNodes from "../../../jsNodes/dataService/initBackend/initBackendNodes"
import initBackendNode_v0 from "../../../jsNodes/dataService/initBackend/v0/initBackendNode"
import subscribeNodes from "../../../jsNodes/dataService/subscribe/subscribeNodes"
import createUserNodes from "../../../jsNodes/dataService/mutate/createUser/createUserNodes"
import updateUserNode_v0 from "../../../jsNodes/dataService/updateUser/v0/updateUserNode"
import mUpdateUserNode_v0 from "../../../jsNodes/dataService/mutate/mUpdateUser/v0/mUpdateUserNode"
import mDeleteUsersNodes from "../../../jsNodes/dataService/mutate/mDeleteUsers/mDeleteUsersNodes"
import createNodes from "../../../jsNodes/dataService/mutate/create/createNodes"
import mCreateNodes from "../../../jsNodes/dataService/mutate/mCreate/mCreateNodes"
import sCreateNode_v0 from "../../../jsNodes/dataService/mutate/sCreate/v0/sCreateNode"
import updateNodes from "../../../jsNodes/dataService/update/updateNodes"
import updateNode_v0 from "../../../jsNodes/dataService/mutate/update/v0/updateNode"
import sUpdateNode_v0 from "../../../jsNodes/dataService/mutate/sUpdate/v0/sUpdateNode"
import smUpdateNode_v0 from "../../../jsNodes/dataService/mutate/smUpdate/v0/smUpdateNode"
import mUpdateNodes from "../../../jsNodes/dataService/mutate/mUpdate/mUpdateNodes"
import mDeleteNodes from "../../../jsNodes/dataService/mutate/mDelete/mDeleteNodes"
import notificationNodes from "../../../jsNodes/notification/notificationNodes"
import uploadWebCamShotsNodes from "../../../jsNodes/uploadFiles/uploadWebCamShots/uploadWebCamShotsNodes"
import createXlsxNode_v0 from "../../../jsNodes/createXlsx/v0/createXlsxNode"

const nodes = [
    ...initBackendNodes, initBackendNode_v0, ...subscribeNodes, ...createUserNodes, updateUserNode_v0, mUpdateUserNode_v0, ...mDeleteUsersNodes,
    ...createNodes, ...mCreateNodes, sCreateNode_v0, ...updateNodes, updateNode_v0, sUpdateNode_v0, smUpdateNode_v0, ...mUpdateNodes,
    ...mDeleteNodes, ...notificationNodes, ...uploadWebCamShotsNodes, createXlsxNode_v0,
]

export default nodes