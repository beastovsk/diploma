import { useMutation } from "react-query";
import { getSessions } from "../../data";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { DatePicker, Empty } from "antd";
import { Button } from "../../shared";
import dayjs from "dayjs";
import loader from "../../assets/loader.svg";

import s from "./HallPlayersSessions.module.scss";

const getDateMonthAgo = (date) => {
	const currentMonth = date.split(" ")[0].split("-")[1];
	const newMonth = String(Number(currentMonth) - 1);

	return `${date.slice(0, 4)}-${
		currentMonth === "01"
			? "12"
			: newMonth.length === 1
			? `0${newMonth}`
			: newMonth
	}${date.slice(7)}`;
};

const getDate = (date = new Date()) => {
	const current = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "2-digit",
	}).format(date);
	return `${date.getFullYear()}-${current.split("/").join("-")}`;
};

// const getValidTime = (hours: string, minutes: string) => {
// 	const newHours = String(hours).length === 1 ? `0${hours}` : String(hours);
// 	const newMinutes =
// 		String(minutes).length === 1 ? `0${minutes}` : String(minutes);

// 	return `${newHours}:${newMinutes}`;
// };

export const HallPlayersSessions = () => {
	const { pathname, search } = useLocation();
	const navigate = useNavigate();
	// const { filters } = useFilterStore();
	const [filtersValue, setFiltersValue] = useState<{
		date: string[];
		time: string[];
	}>({
		date: ["", ""],
		time: ["", ""],
	});
	const [sessions, setSessions] = useState([]);
	const page = pathname.split("/").slice(4, 6);

	const { mutate, isSuccess, isLoading } = useMutation(getSessions);

	useEffect(() => {
		const player = pathname.split("/").at(-1);
		const hallId = pathname.split("/").at(-3);
		let date = [`${getDateMonthAgo(getDate())}`, `${getDate()}`];
		setFiltersValue({ date: ["", ""], time: ["", ""] });

		if (page.length !== 2 && page[1] !== "players") return;

		if (search) {
			const [from, to] = search.split("&");

			const [fromDate, fromTime] = from.split("=")[1].split("_");
			const [toDate, toTime] = to.split("=")[1].split("_");

			setFiltersValue({
				date: [fromDate, toDate],
				time: [fromTime, toTime],
			});

			date = [`${fromDate}`, `${toDate}`];
		}

		mutate(
			{ player, date, hallId },
			{ onSuccess: ({ data }) => setSessions(data.content.list) }
		);
	}, [pathname]);

	const handleFiltersSubmit = () => {
		const player = pathname.split("/").at(-1);
		const hallId = pathname.split("/").at(-3);
		const { date, ...args } = filtersValue;
		const fullDate = [
			`${date[0] || getDateMonthAgo(getDate())}`,
			`${date[1] || getDate()}`,
		];

		navigate({
			search: `from=${fullDate[0].split(" ").join("_")}&to=${fullDate[1]
				.split(" ")
				.join("_")}`,
		});

		mutate(
			{
				hallId,
				date: fullDate,
				player,
				...args,
			},
			{
				onSuccess: (statistic) => {
					if (!Number.isNaN(hallId)) {
						setSessions(statistic?.data?.content.list);
					}
				},
			}
		);
	};

	return page.length === 2 && page[0] === "players" ? (
		<div className={s.container}>
			<div className={s.filter}>
				<label className={s.label}>
					from{" "}
					<DatePicker
						size="large"
						format={"YYYY.MM.DD"}
						value={
							filtersValue.date[0] === ""
								? dayjs(getDateMonthAgo(getDate()))
								: dayjs(filtersValue.date[0])
						}
						onChange={(val) => {
							setFiltersValue((prev) => ({
								...prev,
								date: [getDate(val.$d), prev.date[1]],
							}));
						}}
					/>
					{/* <TimePicker
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
					/> */}
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
					{/* <TimePicker
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
					/> */}
				</label>

				{/* {Object.entries(filters).length ? (
					Object.entries(filters).map(([key, value]) => {
						if (key === "currency") return <></>;

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
				)} */}

				<Button
					style={{ height: "38px" }}
					onClick={handleFiltersSubmit}
				>
					show
				</Button>
			</div>
			<div className={s.table}>
				{isSuccess ? (
					<table>
						<thead>
							<tr>
								{sessions.length
									? Object.keys(sessions[0]).map((key) => (
											<th key={key}>{key}</th>
									  ))
									: null}
							</tr>
						</thead>
						<tbody>
							{sessions.length
								? sessions.map((item) => (
										<tr>
											{Object.values(item).map(
												(value: string) => (
													<th>{value}</th>
												)
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
						<Empty description="Список холлов пуст. Создайте новый" />
					</div>
				)}
			</div>
		</div>
	) : null;
};
