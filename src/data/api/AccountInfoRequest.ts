import axios from "axios";

export const AccountInfoRequest = () => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "account.info",
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
