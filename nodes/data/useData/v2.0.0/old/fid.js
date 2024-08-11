const projectZnGroups = Inputs.projectZnGroups;

const getItemWithFid = (item) => ({ ...item, fid: R.libs.nanoid(8) });

const getItemWithFidsForHdata = (item) => {
	if (item.hierarchyData) {
		const newHdata = {};

		for (const dbClass of Object.keys(item.hierarchyData)) {
			let newItems = [];
			for (const i of item.hierarchyData[dbClass].items) {
				let newItem = getItemWithFid(i);
				if (newItem.hierarchyData) newItem = getItemWithFidsForHdata(newItem);
				newItems.push(newItem);
			}
			newHdata[dbClass] = { ...item.hierarchyData[dbClass], items: newItems };
		}

		return { ...getItemWithFid(item), hierarchyData: newHdata };
	}
};

if (projectZnGroups) {
	let newProjectZnGroups = [];

	for (let projectZnGroup of projectZnGroups) {
		newProjectZnGroups.push(getItemWithFidsForHdata(projectZnGroup));
	}

	Outputs.projectZnGroups = newProjectZnGroups;
}
