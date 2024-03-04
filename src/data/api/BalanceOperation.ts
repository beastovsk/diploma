import axios from "axios";

export const BalanceOperation = (data: {
	id: string;
	operation: string;
	cash: string;
	data: { comment: string };
}) => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "balance.operation",
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

export const BalanceInfo = () => {
	return axios.post(
		"http://localhost/index.php",
		{
			cmd: "account.balance",
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
