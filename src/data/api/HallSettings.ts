import axios from "axios";

export const HallSettings = (data: {
	hallId: string;
	settings: string[];
	update?: { [id: string]: string | number };
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "hall.settings",
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
