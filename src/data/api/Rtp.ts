import axios from "axios";

export const getRtpData = (data: { date: string[]; parent: number }) => {
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
