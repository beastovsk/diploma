import {
	DatePicker,
	Empty,
	Pagination,
	Select,
	Skeleton,
	TimePicker,
} from "antd";
import settings from "../../assets/agent-settings.svg";
import loader from "../../assets/loader.svg";

import s from "./StatisticTable.module.scss";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { ProjectsRequest, useFilterStore, useProfileStore } from "../../data";
import { NavLink } from "react-router-dom";
import { Button } from "../../shared";
import dayjs from "dayjs";

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

const getDate = (date = new Date()) => {
	const current = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "2-digit",
	}).format(date);
	return `${date.getFullYear()}-${current.split("/").join("-")}`;
};

const getValidTime = (hours: string, minutes: string) => {
	const newHours = String(hours).length === 1 ? `0${hours}` : String(hours);
	const newMinutes =
		String(minutes).length === 1 ? `0${minutes}` : String(minutes);

	return `${newHours}:${newMinutes}`;
};

export const StatisticTable = () => {
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { userInfo } = useProfileStore();
	const { filters } = useFilterStore();
	const { mutate, isLoading } = useMutation(ProjectsRequest);
	const [halls, setHalls] = useState([]);
	const [filtersValue, setFiltersValue] = useState({
		date: ["", ""],
		time: ["", ""],
	});

	useEffect(() => {
		const currentId = Number(pathname.split("/").at(-1));
		setFiltersValue({ date: ["", ""], time: ["", ""] });
		setHalls([]);
		let date = [`${getDate()} 00:00`, `${getDate()} 23:59`];

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

		if (currentId) {
			return mutate(
				{
					parent: currentId,
					date,
				},
				{
					onSuccess: (statistic) => {
						if (!Number.isNaN(currentId)) {
							setHalls(statistic?.data?.content.list);
						}
					},
				}
			);
		}
	}, [pathname, userInfo]);

	const handleFiltersSubmit = () => {
		const currentId = Number(pathname.split("/").at(-1));
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
				parent: currentId,
				date: fullDate,
				...args,
			},
			{
				onSuccess: (statistic) => {
					if (!Number.isNaN(currentId)) {
						setHalls(statistic?.data?.content.list);
					}
				},
			}
		);
	};

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

			{halls.length ? (
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
													<span
														className={s.hallName}
													>
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
