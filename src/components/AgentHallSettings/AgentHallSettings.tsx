import { useMutation } from "react-query";
import s from "./AgentHallSettings.module.scss";
import { AgentSettings } from "../../data";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Input, Select, Switch } from "antd";
import { Button } from "../../shared";

export const AgentHallSettings = () => {
	const { pathname } = useLocation();
	const [settings, setSettings] = useState([]);
	const [update, setUpdate] = useState({});
	const { mutate, isLoading } = useMutation(AgentSettings);

	useEffect(() => {
		const currentId = pathname.split("/").at(-2);

		mutate(
			{ id: currentId, settings: ["settings"] },
			{
				onSuccess: (data) => {
					setSettings(data.data.content[0]?.elements);

					const currentItem = {};

					data.data.content[0]?.elements.map(
						({ id, elements, value }) => {
							if (elements && elements.length) {
								return elements.map(({ id: elId, value }) => {
									currentItem[id] = {
										...currentItem[id],
										[elId]: value,
									};
								});
							}
							currentItem[id] = value;
						}
					);

					setUpdate(currentItem);
				},
			}
		);
	}, []);

	const handleSubmit = () => {
		const currentId = pathname.split("/").at(-2);

		mutate({ id: currentId, settings: ["settings"], update });
	};

	const rootElement = ({ type, id, options }) => {
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
						options={options?.map((item: string | string[]) => {
							if (Array.isArray(item) && item.length === 2) {
								const [value, label] = item;
								return {
									label,
									value,
								};
							}
							return {
								label: item,
								value: item,
							};
						})}
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
						value={update[id]}
						onChange={(e) =>
							setUpdate((prev) => ({
								...prev,
								[id]: e ? 1 : 0,
							}))
						}
					/>
				</label>
			);
		}
		return <></>;
	};

	return (
		<div className={s.container}>
			{settings.map(({ id, elements, type, options }) => (
				<label>
					<h2>{elements ? id : ""}</h2>
					<div className={s.form}>
						{elements?.length ? (
							elements?.map(
								({ id: elId, type, value, options }) => {
									if (type === "input" || type === "text") {
										return (
											<label className={s.label} key={id}>
												{elId}
												<Input
													disabled={type === "text"}
													value={update[id][elId]}
													onChange={(e) =>
														setUpdate((prev) => ({
															...prev,
															[id]: {
																...prev[id],
																[elId]: e.target
																	.value,
															},
														}))
													}
												/>
											</label>
										);
									}
									if (type === "select") {
										return (
											<label className={s.label} key={id}>
												{elId}
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
													value={update[id][elId]}
													onChange={(e) =>
														setUpdate((prev) => ({
															...prev,
															[id]: {
																...prev[id],
																[elId]: e.target
																	.value,
															},
														}))
													}
												/>
											</label>
										);
									}
									if (type === "checkbox") {
										return (
											<label className={s.label} key={id}>
												{elId}
												<Switch
													value={update[id][elId]}
													onChange={(e) =>
														setUpdate((prev) => ({
															...prev,
															[id]: {
																...prev[id],
																[elId]: e
																	? 1
																	: 0,
															},
														}))
													}
												/>
											</label>
										);
									}
									return (
										<label className={s.label} key={id}>
											{elId}
											<input type={type} value={value} />
										</label>
									);
								}
							)
						) : (
							<div>{rootElement({ id, type, options })}</div>
						)}
					</div>
				</label>
			))}

			<Button
				size="large"
				type="primary"
				onClick={handleSubmit}
				isLoading={isLoading}
			>
				Отправить
			</Button>
		</div>
	);
};
