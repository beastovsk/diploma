import { useMutation } from "react-query";
import s from "./AgentsTotal.module.scss";
import { AgentsRequest, ProjectsRequest, useProfileStore } from "../../data";
import { useEffect, useState } from "react";
import {
	getDate,
	getFormattedUsersTree,
	getValidTime,
} from "../../utils";
import cx from "classnames";
import { useLocation, useNavigate } from "react-router";
import {
	Button,
	DatePicker,
	Empty,
	Pagination,
	Select,
	Skeleton,
	TimePicker,
	Tooltip,
} from "antd";
import dayjs from "dayjs";
import loader from "../../assets/loader.svg";
import { NavLink } from "react-router-dom";
import settings from "../../assets/agent-settings.svg";

type HallProp = {
	id: string;
	name: string;
	balance: string;
	currency: string;
	bet: string;
	win: string;
	profit: string;
	rtp: string;
};

export const AgentsTotal = () => {
	const navigate = useNavigate();
	const { mutate, isLoading } = useMutation(AgentsRequest);
	const { mutate: mutateProject, isLoading: isProjectLoading } =
		useMutation(ProjectsRequest);
	const [halls, setHalls] = useState([]);
	const [adminIds, setAdminIds] = useState([]);
	const { userInfo } = useProfileStore();
	const { search } = useLocation();
	const [filters, setFilters] = useState({});
	const [filtersValue, setFiltersValue] = useState({
		date: ["", ""],
		time: ["", ""],
	});
	const [agents, setAgents] = useState([]);

	console.log(adminIds);

	const handleFiltersSubmit = () => {
		const { date, time, ...args } = filtersValue;
		const fullDate = [
			`${date[0] || getDate()} ${time[0] || "00:00"}`,
			`${date[1] || getDate()} ${time[1] || "23:59"}`,
		];

		navigate({
			search: `from=${fullDate[0].split(" ").join("_")}&to=${fullDate[1]
				.split(" ")
				.join("_")}`,
		});

		mutate(
			{
				parent: userInfo.id,
				totals: 1,
				date: fullDate,
				...args,
			},
			{
				onSuccess: ({ data }) => {
					if (data.error) return;

					const { agents } = getFormattedUsersTree({
						data: data.content?.list,
						parentId: 0,
					});
					agents.map(({ id }) =>
						setAdminIds((prev) => [...prev, id])
					);
					setFilters(data.content.filters);
					setAgents(agents);
				},
			}
		);
	};

	const handleLoginRequest = ({ parent }) => {
		setHalls([]);

		const { date, time } = filtersValue;

		const fullDate = [
			`${date[0] || getDate()} ${time[0] || "00:00"}`,
			`${date[1] || getDate()} ${time[1] || "23:59"}`,
		];

		mutateProject(
			{ parent, date: fullDate },
			{
				onSuccess: ({ data }) => {
					setHalls(data?.content.list);
				},
			}
		);
	};

	const getTooltipTitle = () => {
		return halls.length ? (
			<div>
				<table>
					<thead>
						<tr>
							<th>id</th>
							<th>name</th>
							<th>balance</th>
							<th>currency</th>
							<th>bet</th>
							<th>win</th>
							<th>profit</th>
							<th>rtp</th>
						</tr>
					</thead>
					<tbody>
						{halls?.length
							? halls?.map(
									({
										id,
										name,
										balance,
										currency,
										bet,
										win,
										profit,
										rtp,
									}: HallProp) => (
										<tr key={id}>
											<th>{id}</th>
											<th>
												<span className={s.hallName}>
													{name}
													<NavLink
														to={`/dashboard/hall-settings/${id}`}
														className={s.icon}
													>
														<img
															src={settings}
															width={20}
															height={20}
														/>
													</NavLink>
												</span>
											</th>
											<th>{balance}</th>
											<th>{currency}</th>
											<th>{bet}</th>
											<th>{win}</th>
											<th>{profit}</th>
											<th>{rtp}</th>
										</tr>
									)
							  )
							: null}
					</tbody>
				</table>
			</div>
		) : isProjectLoading || halls.length ? (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		) : (
			<div className="empty">
				<Empty description="Список холлов пуст. Создайте новый" />
			</div>
		);
	};

	const dispayAgents = (agents) => {
		return agents?.map(({ id, login, totals, agents: childAgents }) => {
			const [currency, statistic] = Object.entries(totals || ["", ""])[0];

			return (
				<>
					{childAgents ? <tr className={s.empty}></tr> : null}
					<tr key={id}>
						<th>{id}</th>
						<th
							className={s.loginTh}
							onMouseEnter={() =>
								handleLoginRequest({ parent: id })
							}
						>
							<p
								className={cx(s.login, {
									[s.agentLogin]: !adminIds.includes(id),
								})}
							>
								<Tooltip
									placement="bottom"
									overlayInnerStyle={{
										width: "max-content",
										minWidth: "500px",
									}}
									title={getTooltipTitle()}
								>
									{login}
								</Tooltip>
							</p>
						</th>
						<th>{currency != "0" ? currency : ""}</th>
						{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
						{/* @ts-expect-error */}
						<th>{statistic?.in}</th>
						{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
						{/* @ts-expect-error */}
						<th>{statistic?.out}</th>
						{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
						{/* @ts-expect-error */}
						<th>{statistic?.bet}</th>
						{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
						{/* @ts-expect-error */}
						<th>{statistic?.win}</th>
					</tr>
					{dispayAgents(childAgents)}
				</>
			);
		});
	};

	useEffect(() => {
		setFiltersValue({ date: ["", ""], time: ["", ""] });
		setAgents([]);
		let date = [
			`${getDate()} 00:00`,
			`${getDate()} 23:59`,
		];

		if (search) {
			const [from, to] = search.split("&");

			const [fromDate, fromTime] = from.split("=")[1].split("_");
			const [toDate, toTime] = to.split("=")[1].split("_");

			setFiltersValue({
				date: [fromDate, toDate],
				time: [fromTime, toTime],
			});

			date = [`${fromDate} ${fromTime}`, `${toDate} ${toTime}`];
		}

		mutate(
			{
				parent: userInfo.id,
				totals: 1,
				date,
			},
			{
				onSuccess: ({ data }) => {
					if (data.error) return;

					const { agents } = getFormattedUsersTree({
						data: data.content?.list,
						parentId: 0,
					});
					agents.map(({ id }) => {
						if (adminIds.includes(id)) return;

						setAdminIds((prev) => [...prev, id]);
					});
					setFilters(data.content.filters);
					setAgents(agents);
				},
			}
		);
	}, [userInfo.id]);

	return (
		<div className={s.container}>
			<div className={s.filter}>
				<label className={s.label}>
					from{" "}
					<DatePicker
						size="large"
						format={"YYYY.MM.DD"}
						value={
							filtersValue.date[0] === ""
								? dayjs(getDate(new Date()))
								: dayjs(filtersValue.date[0])
						}
						onChange={(val) => {
							setFiltersValue((prev) => ({
								...prev,
								date: [getDate(val.$d), prev.date[1]],
							}));
						}}
					/>
					<TimePicker
						size="large"
						format="HH:mm"
						value={
							filtersValue.time[0] === ""
								? dayjs(`00:00`, "HH:mm")
								: dayjs(filtersValue.time[0], "HH:mm")
						}
						onChange={(val) => {
							setFiltersValue((prev) => ({
								...prev,
								time: [
									getValidTime(val.$H, val.$m),
									prev.time[1],
								],
							}));
						}}
					/>
				</label>

				<label className={s.label}>
					to
					<DatePicker
						size="large"
						format={"YYYY.MM.DD"}
						value={
							filtersValue.date[1] === ""
								? dayjs(getDate())
								: dayjs(filtersValue.date[1])
						}
						onChange={(val) => {
							setFiltersValue((prev) => ({
								...prev,
								date: [prev.date[0], getDate(val.$d)],
							}));
						}}
					/>
					<TimePicker
						size="large"
						format="HH:mm"
						value={
							filtersValue.time[1] === ""
								? dayjs(`23:59`, "HH:mm")
								: dayjs(filtersValue.time[1], "HH:mm")
						}
						onChange={(val) => {
							setFiltersValue((prev) => ({
								...prev,
								time: [
									prev.time[0],
									getValidTime(val.$H, val.$m),
								],
							}));
						}}
					/>
				</label>

				{Object.entries(filters).length ? (
					Object.entries(filters).map(([key, value]) => {
						const options = [];

						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						value.map((item) => {
							if (item === "" || item.includes("")) return;
							if (item.length === 2) {
								const [value, label] = item;
								return options.push({
									label,
									value,
								});
							}

							options.push({ label: item, value: item });
						});

						return (
							<Select
								placeholder={key}
								mode="multiple"
								size="middle"
								style={{ height: "38px" }}
								options={options}
								maxTagCount={1}
								onChange={(val) =>
									setFiltersValue((prev) => ({
										...prev,
										[key]: val,
									}))
								}
							/>
						);
					})
				) : (
					<>
						<Skeleton.Button
							active
							style={{
								width: "80px",
								height: "38px",
								borderRadius: "5px",
							}}
						/>
						<Skeleton.Button
							active
							style={{
								width: "80px",
								height: "38px",
								borderRadius: "5px",
							}}
						/>
						<Skeleton.Button
							active
							style={{
								width: "80px",
								height: "38px",
								borderRadius: "5px",
							}}
						/>
					</>
				)}

				<Button
					style={{ height: "38px" }}
					onClick={handleFiltersSubmit}
				>
					show
				</Button>
			</div>

			{agents.length ? (
				<div>
					<table>
						<thead>
							<tr>
								<th>id</th>
								<th>login</th>
								<th>currency</th>
								<th>in</th>
								<th>out</th>
								<th>totalbet</th>
								<th>totalwin</th>
							</tr>
						</thead>
						<tbody>
							{agents?.length ? dispayAgents(agents) : null}
						</tbody>
					</table>

					<div className={s.pagination}>
						<Pagination defaultCurrent={1} total={50} />
					</div>
				</div>
			) : isLoading ? (
				<div className="loader">
					<img src={loader} width={50} height={50} />
				</div>
			) : (
				<div className="loader">
					<Empty description="Список холлов пуст. Создайте новый" />
				</div>
			)}
		</div>
	);
};
