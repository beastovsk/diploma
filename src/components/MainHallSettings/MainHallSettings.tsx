import { useMutation } from "react-query";
import s from "./MainHallSettings.module.scss";
import { HallSettings } from "../../data";
import { SetStateAction, useEffect, useState } from "react";

import { Input, Select, Switch } from "antd";
import { Button } from "../../shared";

import { useLocation } from "react-router";

type SettingsProps = {
	id: string;
	elements: {
		id: string;
		type: string;
		value: string;
		options?: string[];
		required: number;
	}[];
};

export const MainHallSettings = () => {
	const { pathname } = useLocation();
	const { mutate, isLoading } = useMutation(HallSettings);
	const [settings, setSettings] = useState<SettingsProps[] | []>([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});

	const handleSubmitForm = () => {
		const currentId = pathname.split("/")[3];
		const settings = pathname.split("/").at(-1);

		mutate({ hallId: currentId, settings: [settings], update });
	};

	const getFormFields = (
		type: string,
		fieldId: string,
		id: string,
		options: string[],
		elements: []
	) => {
		if (type === "input" || type === "text" || type === "password") {
			return (
				<label className={s.label} key={fieldId}>
					<div>{fieldId}</div>
					<Input
						disabled={type === "text"}
						type={type}
						value={update[id][fieldId]}
						onChange={(e) =>
							setUpdate((prev) => ({
								...prev,
								[id]: {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									...update[id],
									[fieldId]: e.target.value,
								},
							}))
						}
					/>
				</label>
			);
		}
		if (type === "select") {
			return (
				<label className={s.label} key={fieldId}>
					<div>{fieldId}</div>
					<Select
						options={options?.map((item) => {
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
						value={update[id][fieldId]}
						onChange={(e) =>
							setUpdate((prev) => ({
								...prev,
								[id]: {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									...update[id],
									[fieldId]: e,
								},
							}))
						}
					/>
				</label>
			);
		}
		if (type === "checkbox") {
			return (
				<label className={s.label} key={fieldId}>
					<div>{fieldId}</div>
					<Switch
						value={Boolean(update[id][fieldId])}
						onChange={(e) =>
							setUpdate((prev) => ({
								...prev,
								[id]: {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									...update[id],
									[fieldId]: e ? 1 : 0,
								},
							}))
						}
					/>
				</label>
			);
		}
		if (elements && elements.length) {
			return (
				<div className={s.nested}>
					<h3>{fieldId}</h3>
					<div>
						{elements.map(({ id: curId, options, type, range }) => {
							if (
								type === "input" ||
								type === "text" ||
								type === "password"
							) {
								return (
									<label className={s.label} key={curId}>
										<div>{curId}</div>
										<Input
											disabled={type === "text"}
											type={type}
											value={update[id][fieldId][curId]}
											onChange={(e) =>
												setUpdate((prev) => ({
													...prev,
													[id]: {
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														...prev[id],
														[fieldId]: {
															...prev[id][
																fieldId
															],
															[curId]:
																e.target.value,
														},
													},
												}))
											}
										/>
									</label>
								);
							}
							if (type === "select") {
								const optionsResult = [];

								if (options) {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									const res = options?.map((item) => {
										if (
											Array.isArray(item) &&
											item.length === 2
										) {
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
									});

									optionsResult.push(res);
								}
								if (range) {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									const [start, end] = range;
									for (let i = start; i <= end; i++) {
										optionsResult.push({
											label: i,
											value: i,
										});
									}
								}

								return (
									<label className={s.label} key={curId}>
										<div>{curId}</div>
										<Select
											options={optionsResult}
											showSearch
											value={update[id][fieldId][curId]}
											onChange={(e) => {
												setUpdate((prev) => ({
													...prev,
													[id]: {
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														...update[id],
														[fieldId]: {
															...update[id][
																fieldId
															],
															[curId]: e,
														},
													},
												}));
											}}
										/>
									</label>
								);
							}
							if (type === "checkbox") {
								return (
									<label className={s.label} key={curId}>
										<div>{curId}</div>
										<Switch
											value={Boolean(
												update[id][fieldId][curId]
											)}
											onChange={(e) =>
												setUpdate((prev) => ({
													...prev,
													[id]: {
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														...update[id],
														[fieldId]: {
															...update[id][
																fieldId
															],
															[curId]: e ? 1 : 0,
														},
													},
												}))
											}
										/>
									</label>
								);
							}
						})}
					</div>
				</div>
			);
		}
		return (
			<label className={s.label} key={fieldId}>
				<div>{fieldId}</div>{" "}
				<input
					type={type}
					value={update[id][fieldId]}
					onChange={(e) =>
						setUpdate((prev) => ({
							...prev,
							[id]: {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								...update[id],
								[fieldId]: e.target.value,
							},
						}))
					}
				/>
			</label>
		);
	};

	useEffect(() => {
		const settingsLink = pathname.split("/").at(-1);
		const currentId = pathname.split("/")[3];
		setSettings([]);
		setUpdate({});

		const urls = pathname.split("/").slice(4, 6).join("/");

		mutate(
			{
				hallId: currentId,
				settings:
					urls !== "games/settings"
						? [settingsLink]
						: ["gamesSettings"],
			},
			{
				onSuccess: ({ data }) => {
					const currentItem: SetStateAction<{
						[id: string]: string | number;
					}> = {};

					data.content.map(
						({
							id: typeId,
							elements,
						}: {
							id: string;
							elements: [];
						}) => {
							elements.map(
								({ id, value, elements: nestedElements }) => {
									currentItem[typeId] = {
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-expect-error
										...currentItem[typeId],
										[id]: value,
									};

									if (nestedElements) {
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-expect-error
										nestedElements.map(
											({
												id: nestedId,
												value: nestedValue,
											}) => {
												currentItem[typeId] = {
													// eslint-disable-next-line @typescript-eslint/ban-ts-comment
													// @ts-expect-error
													...currentItem[typeId],
													[id]: {
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														...currentItem[typeId][
															id
														],
														[nestedId]: nestedValue,
													},
												};
											}
										);
									}
								}
							);
						}
					);

					setSettings(data.content);
					setUpdate(currentItem);
				},
			}
		);
	}, [pathname]);

	return (
		<div className={s.content}>
			{settings.length ? (
				<div className={s.form}>
					<div>
						{settings.map(({ id, elements }) => (
							<div key={id}>
								<h2>{id}</h2>
								{elements.map(
									({
										id: fieldId,
										options,
										type,
										elements: nestedElements,
									}) => {
										return getFormFields(
											type,
											fieldId,
											id,
											options,
											nestedElements
										);
									}
								)}
							</div>
						))}
					</div>
					<Button
						isLoading={isLoading}
						type="primary"
						size="large"
						onClick={() => handleSubmitForm()}
					>
						Отправить
					</Button>
				</div>
			) : null}
		</div>
	);
};
