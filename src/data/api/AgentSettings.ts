import axios from "axios";

export const AgentSettings = (data: {
	id: string;
	settings: string[];
	update?: object;
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "agent.settings",
			token: localStorage.getItem("token"),
			data: { ...data },
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
