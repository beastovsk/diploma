import axios from "axios";

export const AgentsRequest = (data: { parent: number; date?: string[] }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "treeGet",
			data: { ...data, isUpdate: "0" },
			token: localStorage.getItem("token"),
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
