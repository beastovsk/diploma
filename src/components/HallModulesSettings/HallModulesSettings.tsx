import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { HallSettingsModules } from "../../data";
import { useMutation } from "react-query";
import { Input, Select, Switch } from "antd";

import s from "./HallModulesSettings.module.scss";
import { Button } from "../../shared";

type ModuleSettingsProps = {
	id: string;
	value: string;
	type: string;
	options?: [];
};

export const HallModulesSettings = () => {
	const { pathname } = useLocation();
	const [modules, setModules] = useState<ModuleSettingsProps[] | []>([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});
	const { mutate, isLoading } = useMutation(HallSettingsModules);

	const handleSubmit = () => {
		const hallId = pathname.split("/")[3];
		const module = pathname.split("/").at(-1);

		mutate(
			{ hallId, module, update },
		);
	};

	useEffect(() => {
		const currentId = pathname.split("/")[3];
		const currentPath = pathname.split("/")[4];

		setModules([]);
		setUpdate({});

		if (Number.isNaN(Number(currentId)) || currentPath !== "modules")
			return;
		const module = pathname.split("/").at(-1);

		mutate(
			{ hallId: currentId, module },
			{
				onSuccess: ({ data }) => {
					if (data.error) return;
					const update: { [id: string]: string } = {};

					data.content.map(
						({ id, value }: { id: string; value: string }) => {
							update[id] = value;
						}
					);

					setUpdate(update);
					setModules(data.content);
				},
			}
		);
	}, [pathname]);

	return (
		<>
			{modules.length ? (
				<div className={s.wrapper}>
					{modules.map(
						({ id, type, value, options }: ModuleSettingsProps) => {
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
						}
					)}

					<Button
						size="large"
						type="primary"
						isLoading={isLoading}
						onClick={handleSubmit}
					>
						Отправить
					</Button>
				</div>
			) : null}
		</>
	);
};
