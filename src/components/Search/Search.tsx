import { useLocation } from "react-router";
import { useMutation } from "react-query";
import { SearchInfo } from "../../data";
import loader from "../../assets/loader.svg";

import s from "./Search.module.scss";
import { useEffect, useState } from "react";
import { Empty } from "antd";
import { NavLink } from "react-router-dom";

export const Search = () => {
	const { pathname, search } = useLocation();
	const { mutate, isSuccess, isLoading } = useMutation(SearchInfo);
	const [result, setResult] = useState([]);
	const [typeSearch, valueSearch] = search.slice(1).split("&");
	const typeValue = typeSearch.split("=")[1];
	const searchValue = valueSearch.split("=")[1];

	useEffect(() => {
		setResult([]);

		mutate(
			{ type: typeValue, value: searchValue },
			{
				onSuccess: ({ data }) => {
					const result = data.content.result;

					setResult(result);
				},
			}
		);
	}, [pathname, search]);

	const getTableHeader = () => {
		if (typeValue === "login") {
			return (
				<tr>
					<th>id</th>
					<th>login</th>
				</tr>
			);
		}
		if (typeValue === "player") {
			return (
				<tr>
					<th>player</th>
					<th>currency</th>
					<th>hallId</th>
				</tr>
			);
		}
		if (typeValue === "actionId") {
			return (
				<tr>
					<th>sessionId</th>
					<th>actionId</th>
					<th>bet</th>
					<th>win</th>
					<th>action</th>
				</tr>
			);
		}
	};

	return (
		<div className={s.container}>
			<h3>Search Result</h3>

			<div className={s.table}>
				{isSuccess ? (
					<table>
						<thead>{getTableHeader()}</thead>
						<tbody>
							{result?.length
								? result.map((item) => {
										if (typeValue === "login") {
											const { id, login, type } = item;

											const link =
												type === "hall"
													? `/dashboard/hall-settings/${id}/settings`
													: `/dashboard/agent/${id}/settings`;

											return (
												<tr>
													<th>{id}</th>
													<th>
														<NavLink to={link}>
															{login}
														</NavLink>
													</th>
												</tr>
											);
										}

										if (typeValue === "player") {
											const { player, currency, hallId } =
												item;

											return (
												<tr>
													<th>
														<NavLink
															to={`/dashboard/hall-settings/${hallId}/players/${player}`}
														>
															{player}
														</NavLink>
													</th>
													<th>{currency}</th>
													<th>
														<NavLink
															to={`/dashboard/hall-settings/${hallId}/players`}
														>
															{hallId}
														</NavLink>
													</th>
												</tr>
											);
										}

										if (typeValue === "actionId") {
											const {
												sessionId,
												actionId,
												bet,
												win,
												action,
												hallId,
												player,
											} = item;

											const link = `/dashboard/hall-settings/${hallId}/players/${player}/${sessionId}`;

											return (
												<tr>
													<th>
														<NavLink to={link}>
															{sessionId}
														</NavLink>
													</th>
													<th>{actionId}</th>
													<th>{bet}</th>
													<th>{win}</th>
													<th>{action}</th>
												</tr>
											);
										}
								  })
								: null}
						</tbody>
					</table>
				) : isLoading ? (
					<div className="loader">
						<img src={loader} width={50} height={50} />
					</div>
				) : (
					<div className="loader">
						<Empty description="Нет результатов" />
					</div>
				)}
			</div>
		</div>
	);
};
