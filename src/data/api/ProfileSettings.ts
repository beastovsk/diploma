import axios from "axios";

export const ProfileSettings = (data: object) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "account.profile",
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
