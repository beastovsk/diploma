import { useMutation } from "react-query";
import { getSessionLog } from "../../data";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import loader from "../../assets/loader.svg";

import s from "./HallPlayersSessionsLogs.module.scss";
import { Empty } from "antd";

export const HallPlayersSessionsLogs = () => {
	const { mutate, isLoading } = useMutation(getSessionLog);
	const { pathname } = useLocation();
	const [game, setGame] = useState({
		name: "",
		label: "",
		provider: "",
	});
	const [logs, setLogs] = useState([]);
	const currentUrl = pathname.split("/").slice(4, 8);
	const isVisible = currentUrl.length === 3 && currentUrl.includes("players");

	useEffect(() => {
		setLogs([]);
		setGame({
			name: "",
			label: "",
			provider: "",
		});

		if (!isVisible) return;
		const sessionId = pathname.split("/").at(-1);

		mutate(
			{ sessionId },
			{
				onSuccess: ({ data }) => {
					if (data.error) return;
					const {
						game: { name, label, provider },
						logs,
					} = data.content;
					setGame({ name, label, provider });
					setLogs(logs);
				},
			}
		);
	}, [pathname]);

	if (isLoading) {
		return (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		);
	}

	return isVisible ? (
		<div className={s.container}>
			<div>
				<h2>
					<span className={s.label}>name:</span> {game.name}
				</h2>
				<h2>
					<span className={s.label}>label:</span> {game.label}
				</h2>
				<h2>
					<span className={s.label}>provider:</span> {game.provider}
				</h2>
			</div>
			<div className={s.table}>
				{logs.length ? (
					<table>
						<thead>
							<tr>
								{logs.length
									? Object.keys(logs[0]).map(
											(item: string) => <th>{item}</th>
									  )
									: null}
							</tr>
						</thead>
						<tbody className={s.body}>
							{logs.length
								? logs.map((log) => (
										<tr>
											{Object.values(log).map(
												(item: string) => (
													<th>{item}</th>
												)
											)}
										</tr>
								  ))
								: null}
						</tbody>
					</table>
				) : (
					<Empty description="Список логов пуст" />
				)}
			</div>
		</div>
	) : null;
};
