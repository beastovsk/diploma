import axios from "axios";

export const HallSettingsRtp = (data: { hallId: string; date: string[] }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "rtp",
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
