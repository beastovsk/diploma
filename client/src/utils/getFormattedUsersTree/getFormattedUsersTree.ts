type UsersRequest = {
	data: [];
	parentId: number;
};

type UserNode = {
	login: string;
	id: number;
	agents?: { id: number; totals?: object }[];
	totals?: object;
};

export const getFormattedUsersTree = ({ data, parentId }: UsersRequest) => {
	const buildTree = (
		data: { parent: number; login: string; id: number; totals: object }[],
		parentId: number
	) => {
		const node: UserNode = { id: parentId, login: "", totals: {} };
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
				(item: { id: number; login: string; totals: object }) =>
					item.id === parentId
			);
			if (item) {
				node.id = item.id;
				node.login = item.login;
				node.totals = item.totals || null;
			}
		}
		return node;
	};

	return buildTree(data, parentId);
};
