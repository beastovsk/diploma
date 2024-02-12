import axios from "axios";

export const LoginRequest = (data: { login: string; password: string }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "account.signIn",
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
