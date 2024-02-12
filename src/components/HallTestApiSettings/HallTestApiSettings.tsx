import { SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { HallSettings } from "../../data";
import { useMutation } from "react-query";
import { Input, Select, Switch, Button } from "antd";
import { Button as ButtonShared } from "../../shared";

import s from "./HallTestApiSettings.module.scss";

type SettingsProps = {
	[id: string]: [];
};

export const HallTestApiSettings = () => {
	const { pathname } = useLocation();
	const [settings, setSettings] = useState<SettingsProps[] | object>({});
	const [cmd, setCmd] = useState("");
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});
	const [response, setResponse] = useState([]);
	const { mutate } = useMutation(HallSettings);

	const handleSubmit = () => {
		const hallId = pathname.split("/")[3];
		const settings = pathname.split("/").at(-1);

		mutate(
			{ hallId, settings: [settings], update },
			{
				onSuccess: ({ data }) => {
					setResponse(data.content[0].elements);
				},
			}
		);
	};

	useEffect(() => {
		if (!cmd) return;
		setResponse([]);
		const currentItem = {};

		settings[cmd].map(({ id, value }) => {
			currentItem[id] = value;
		});

		setUpdate(currentItem);
	}, [cmd]);

	useEffect(() => {
		const hallId = pathname.split("/")[3];
		const settings = pathname.split("/").at(-1);

		setSettings([]);
		setUpdate({});
		setCmd("");
		setResponse([]);

		if (Number.isNaN(Number(hallId)) || settings !== "testApi") return;

		mutate(
			{ hallId, settings: [settings] },
			{
				onSuccess: ({ data }) => {
					if (data.error) return;

					const currentItem = {};

					data.content[0].elements.map(({ id, elements }) => {
						currentItem[id] = elements;
					});

					setSettings(
						currentItem as SetStateAction<[] | SettingsProps[]>
					);
				},
			}
		);
	}, [pathname]);

	return settings ? (
		<div className={s.container}>
			<div className={s.header}>
				{Object.keys(settings).map((label) => (
					<Button onClick={() => setCmd(label)}>{label}</Button>
				))}
			</div>

			{cmd ? (
				<div className={s.content}>
					<div className={s.form}>
						{settings[cmd]?.map(({ id, type, value, options }) => {
							if (type === "input" || type === "text") {
								return (
									<label className={s.label} key={id}>
										{id}
										<Input
											disabled={type === "text"}
											value={update[id]}
											onChange={(e) =>
												setUpdate((prev) => ({
													...prev,
													[id]: e.target.value,
												}))
											}
										/>
									</label>
								);
							}
							if (type === "select") {
								return (
									<label className={s.label} key={id}>
										{id}
										<Select
											options={options?.map(
												(item: string | string[]) => {
													if (
														Array.isArray(item) &&
														item.length === 2
													) {
														const [label, value] =
															item;
														return { label, value };
													}
													return {
														label: item,
														value: item,
													};
												}
											)}
											value={update[id]}
											onChange={(e) =>
												setUpdate((prev) => ({
													...prev,
													[id]: e,
												}))
											}
										/>
									</label>
								);
							}
							if (type === "checkbox") {
								return (
									<label className={s.label} key={id}>
										{id}
										<Switch
											value={
												update[id] == "1" ? true : false
											}
											onChange={(e) =>
												setUpdate((prev) => ({
													...prev,
													[id]: e ? "1" : "0",
												}))
											}
										/>
									</label>
								);
							}
							return (
								<label className={s.label} key={id}>
									{id}
									<input type={type} value={value} />
								</label>
							);
						})}
					</div>
					<ButtonShared
						onClick={handleSubmit}
						size="large"
						type="primary"
					>
						Отправить
					</ButtonShared>

					<div className={s.response}>
						{response?.map(({ id, value }) => (
							<label className={s.label} key={id}>
								<span>{id}</span>
								<span>{value}</span>
							</label>
						))}
					</div>
				</div>
			) : null}
		</div>
	) : null;
};
