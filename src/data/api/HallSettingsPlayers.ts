import axios from "axios";

export const getPlayers = (data: { hallId: string; date: string[] }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "players",
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

export const getSessions = (data: {
	hallId: string;
	player: string;
	date: string[];
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "session.list",
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
export const getSessionLog = (data: { sessionId: string }) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "session.log",
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
