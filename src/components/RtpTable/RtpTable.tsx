import { useMutation } from "react-query";
import { getRtpData, useFilterStore, useProfileStore } from "../../data";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { DatePicker, Empty, Select, Skeleton } from "antd";
import { Button } from "../../shared";
import dayjs from "dayjs";
import loader from "../../assets/loader.svg";

import s from "./RtpTable.module.scss";

const getDate = (date = new Date()) => {
	const current = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "2-digit",
	}).format(date);
	return `${date.getFullYear()}-${current.split("/").join("-")}`;
};

export const RtpTable = () => {
	const { pathname, search } = useLocation();
	const navigate = useNavigate();
	// const { filters } = useFilterStore();
	const [filtersValue, setFiltersValue] = useState<{
		date: string[];
	}>({
		date: ["", ""],
	});
	const [sessions, setSessions] = useState([]);
	const { userInfo } = useProfileStore();
	const { filters } = useFilterStore();
	const { mutate, isSuccess, isLoading } = useMutation(getRtpData);

	useEffect(() => {
		let date = [`${getDate()} 00:00`, `${getDate()} 23:59`];
		setFiltersValue({ date: ["", ""] });

		if (!userInfo?.id) return;
		if (search) {
			const [from, to] = search.split("&");

			const [fromDate] = from.split("=")[1].split("_");
			const [toDate] = to.split("=")[1].split("_");

			setFiltersValue({
				date: [fromDate, toDate],
			});

			date = [`${fromDate}`, `${toDate}`];
		}

		mutate(
			{ date, parent: userInfo?.id },
			{ onSuccess: ({ data }) => setSessions(data.content) }
		);
	}, [userInfo]);

	const handleFiltersSubmit = () => {
		const { date, ...args } = filtersValue;
		const fullDate = [`${date[0] || getDate()}`, `${date[1] || getDate()}`];

		navigate({
			search: `from=${fullDate[0].split(" ").join("_")}&to=${fullDate[1]
				.split(" ")
				.join("_")}`,
		});

		mutate(
			{
				parent: userInfo?.id,
				date: fullDate,
				...args,
			},
			{
				onSuccess: ({ data }) => {
					if (data.error) return;
					setSessions(data?.content);
				},
			}
		);
	};

	return pathname.split("/").at(-1) === "rtp" ? (
		<div className={s.container}>
			<div className={s.filter}>
				<label className={s.label}>
					from{" "}
					<DatePicker
						size="large"
						format={"YYYY.MM.DD"}
						value={
							filtersValue.date[0] === ""
								? dayjs(getDate())
								: dayjs(filtersValue.date[0])
						}
						onChange={(val) => {
							setFiltersValue((prev) => ({
								...prev,
								date: [getDate(val.$d), prev.date[1]],
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
				</label>

				{Object.entries(filters).length ? (
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
				)}

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
								{sessions?.length
									? Object.keys(sessions[0]).map((key) => (
											<th key={key}>{key}</th>
									  ))
									: null}
							</tr>
						</thead>
						<tbody>
							{sessions?.length
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
