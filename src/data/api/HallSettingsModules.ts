import axios from "axios";

export const HallSettingsModules = (data: {
	hallId: string;
	module: string;
	update?: object;
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "modules",
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
