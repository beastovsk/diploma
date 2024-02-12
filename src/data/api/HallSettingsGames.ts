import axios from "axios";

export const HallSettingsGames = (data: {
	id: string;
	action: string[];
	update: Record<string, object>;
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "hall.settings.games",
			token: localStorage.getItem("token"),
			data,
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
