import { useLocation } from "react-router";
import { useMutation } from "react-query";
import { SearchInfo } from "../../data";
import loader from "../../assets/loader.svg";

import s from "./Search.module.scss";
import { useEffect, useState } from "react";
import { Empty } from "antd";

export const Search = () => {
	const { pathname, search } = useLocation();
	const { mutate, isSuccess, isLoading } = useMutation(SearchInfo);
	const [result, setResult] = useState([]);
	// const [api, contextHolder] = notification.useNotification();

	useEffect(() => {
		const [typeSearch, valueSearch] = search.slice(1).split("&");
		const typeValue = typeSearch.split("=")[1];
		const searchValue = valueSearch.split("=")[1];

		mutate(
			{ type: typeValue, value: searchValue },
			{
				onSuccess: ({ data }) => {
					setResult(data.content.result);
				},
			}
		);
	}, [pathname, search]);

	return (
		<div className={s.container}>
			<h3>Result</h3>

			<div className={s.table}>
				{isSuccess ? (
					<table>
						<thead>
							<tr>
								{result?.length
									? Object.keys(result[0]).map((key) => (
											<th key={key}>{key}</th>
									  ))
									: null}
							</tr>
						</thead>
						<tbody>
							{result?.length
								? result.map((item) => (
										<tr>
											{Object.values(item).map(
												(value: string) => {
													return <th>{value}</th>;
												}
											)}
										</tr>
								  ))
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
