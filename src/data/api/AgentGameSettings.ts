import axios from "axios";

export const AgentGameSettings = ({
	id,
	update,
}: {
	id: string;
	update?: Record<string, object>;
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "agent.settings.games",
			token: localStorage.getItem("token"),
			data: { id, action: "providers", update },
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
