import { useMutation } from "react-query";
import { getSessionLog } from "../../data";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import loader from "../../assets/loader.svg";

import s from "./HallPlayersSessionsLogs.module.scss";
import { Empty, Tooltip } from "antd";

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
	console.log(logs);
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
							{logs.length ? (
								<tr>
									<th>id</th>
									<th>action</th>
									<th>before</th>
									<th>bet</th>
									<th>win</th>
									<th>betInfo</th>
									<th>matrix</th>
									<th>winLines</th>
									<th>dateTime</th>
								</tr>
							) : null}
						</thead>
						<tbody className={s.body}>
							{logs.length
								? logs.map(
										({
											id,
											actionId,
											action,
											error,
											before,
											bet,
											win,
											betInfo,
											dateTime,
											matrix,
											winLines,
											response,
										}) => (
											<tr
												className={
													error ? s.error : null
												}
											>
												<th className={s.id}>
													<Tooltip
														title={response}
														placement="bottom"
														overlayInnerStyle={{
															width: "max-content",
														}}
													>
														{id}
													</Tooltip>
												</th>
												<th>{action}</th>
												<th>{before}</th>
												<th>{bet}</th>
												<th>{win}</th>
												<th>{betInfo}</th>
												<th className={s.flex}>
													<span>{matrix}</span>
													<span>{actionId}</span>
												</th>
												<th>{winLines}</th>
												<th>{dateTime}</th>
											</tr>
										)
								  )
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
