import axios from "axios";

export const HallCreate = (data: { parent: number }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "hall.create",
			token: localStorage.getItem("token"),
			data: { ...data, type: "api" },
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
