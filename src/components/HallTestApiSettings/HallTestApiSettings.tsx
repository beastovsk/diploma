import { SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { HallSettings } from "../../data";
import { useMutation } from "react-query";
import { Input, Select, Switch, Button } from "antd";
import { Button as ButtonShared } from "../../shared";

import copy from "../../assets/copy.svg";

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

	const handleCopy = async ({
		copyValue,
		copyJson,
	}: {
		copyValue: string;
		copyJson?: [];
	}) => {
		if (copyValue) {
			return await navigator.clipboard.writeText(copyValue);
		}
		if (copyJson) {
			const res = {};
			copyJson.map(({ id, value }) => (res[id] = value));

			return await navigator.clipboard.writeText(JSON.stringify(res));
		}
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
					<div className={s.wrapper}>
						<h3 className={s.contentLabel}>{cmd}</h3>
						<div className={s.form}>
							{settings[cmd]?.map(
								({ id, type, value, options }) => {
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
															[id]: e.target
																.value,
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
														(
															item:
																| string
																| string[]
														) => {
															if (
																Array.isArray(
																	item
																) &&
																item.length ===
																	2
															) {
																const [
																	label,
																	value,
																] = item;
																return {
																	label,
																	value,
																};
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
														update[id] == "1"
															? true
															: false
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
								}
							)}
							<ButtonShared
								onClick={handleSubmit}
								size="large"
								type="primary"
							>
								Отправить
							</ButtonShared>
						</div>
					</div>

					<div className={s.wrapper}>
						<div className={s.response}>
							<span className={s.contentLabel}>
								<h3>Data</h3>
								<span
									className={s.copyButton}
									onClick={() =>
										handleCopy({
											copyValue: "",
											copyJson: response as [],
										})
									}
								>
									<img src={copy} />
								</span>
							</span>

							<div className={s.form}>
								{response?.map(({ id, value }) => (
									<label className={s.responseLabel} key={id}>
										<span className={s.id}>{id}</span>
										<span className={s.value}>
											<p>{value}</p>
											<div className={s.copyValue}>
												<span
													className={s.copyButton}
													onClick={() =>
														handleCopy({
															copyValue: value,
														})
													}
												>
													<img src={copy} />
												</span>
											</div>
										</span>
									</label>
								))}
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	) : null;
};
