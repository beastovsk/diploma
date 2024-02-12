import axios from "axios";

export const HallSettingsInit = (hallId: { hallId: string }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "hall.settings.init",
			token: localStorage.getItem("token"),
			data: hallId,
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
