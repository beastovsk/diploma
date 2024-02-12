type UsersRequest = {
	data: [];
	parentId: number;
};

type UserNode = {
	login: string;
	id: number;
	agents?: { id: number }[];
};

export const getFormattedUsersTree = ({ data, parentId }: UsersRequest) => {
	const buildTree = (
		data: { parent: number; login: string; id: number }[],
		parentId: number
	) => {
		const node: UserNode = { id: parentId, login: "" };
		for (let i = 0; i < data?.length; i++) {
			if (data[i].parent === parentId) {
				const childNode: UserNode = buildTree(data, data[i].id);
				if (childNode) {
					if (!node.agents) {
						node.agents = [];
					}
					node.agents.push(childNode);
				}
			}
		}
		if (node.agents) {
			node.agents.sort(
				(a: { id: number }, b: { id: number }) => a.id - b.id
			);
		}
		if (parentId !== 0) {
			const item = data.find(
				(item: { id: number; login: string }) => item.id === parentId
			);
			if (item) {
				node.id = item.id;
				node.login = item.login;
			}
		}
		return node;
	};

	return buildTree(data, parentId);
};
