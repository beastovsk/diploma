import axios from "axios";

export const HallSettingsBalance = (data: {
	id: string;
	date: string[];
	update?: object;
	currency?: string;
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "balance.logs",
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
