import axios from "axios";

export const AgentCreate = ({
	parent,
	login,
	password,
}: {
	parent: number;
	login: string;
	password: string;
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "agent.create",
			token: localStorage.getItem("token"),
			data: {
				parent,
				login,
				password,
			},
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
