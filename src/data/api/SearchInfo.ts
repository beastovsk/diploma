import axios from "axios";

export const SearchInfo = (data) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "search",
			token: localStorage.getItem("token"),
			data: { ...data },
		},
		{
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}
	);
};
