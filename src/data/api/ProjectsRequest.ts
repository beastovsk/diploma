import axios from "axios";

export const ProjectsRequest = (data: { parent: number; date?: string[] }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "treeGet",
			data: { ...data, isUpdate: "1" },
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
