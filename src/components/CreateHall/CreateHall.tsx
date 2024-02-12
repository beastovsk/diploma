import { Input, Select, Switch } from "antd";
import s from "./CreateHall.module.scss";
import { HallCreate } from "../../data";
import { useMutation } from "react-query";
import { SetStateAction, useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";

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

export const CreateHall = ({
	parent,
	closeModal,
}: {
	parent: number;
	closeModal: () => void;
}) => {
	const { mutate, isLoading } = useMutation(HallCreate);

	const [settings, setSettings] = useState<SettingsProps[] | []>([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});
	const [requiredFields, setRequiredFields] = useState<string[] | []>([]);

	useEffect(() => {
		mutate(
			{ parent },
			{
				onSuccess: (data) => {
					setSettings(data.data.content);
					const currentItem: SetStateAction<{
						[id: string]: string | number;
					}> = {};

					data.data.content.map(
						({ id: typeId, elements }: SettingsProps) => {
							elements.map(({ id, value, required }) => {
								currentItem[typeId] = {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									...currentItem[typeId],
									[id]: value,
								};
								if (required) {
									setRequiredFields((prev) => [...prev, id]);
								}
							});
						}
					);

					setUpdate(currentItem);
				},
			}
		);
	}, [parent]);

	if (!settings?.length) {
		return (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		);
	}

	const handleSubmitForm = () => {
		let emptyFields: string[] = [];
		let isAvialable = false;

		Object.entries(update).map((entry) => {
			Object.entries(entry[1]).map((field) => {
				const [name, value] = field;
				if (value === "") {
					emptyFields.push(name);
				}
			});
		});

		emptyFields.map((item) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (!requiredFields.includes(item)) return (isAvialable = true);
		});

		if (!emptyFields.length || isAvialable) {
			mutate(
				{
					parent,
					...update,
				},
				{
					onSuccess: () => {
						closeModal();
						setRequiredFields([]);
						emptyFields = [];
					},
				}
			);
		}
	};

	return (
		<div className={s.container}>
			<div className={s.form}>
				{settings.map(({ id, elements }) => (
					<div key={id}>
						<h2>{id}</h2>
						{elements.map(
							({ id: fieldId, options, type, required }) => {
								if (
									type === "input" ||
									type === "text" ||
									type === "password"
								) {
									return (
										<label
											className={s.label}
											key={fieldId}
										>
											<div>
												{fieldId}
												{required ? (
													<span
														className={s.required}
													>
														{" "}
														*
													</span>
												) : null}
											</div>
											<Input
												disabled={type === "text"}
												type={type}
												required={Boolean(required)}
												value={update[id][fieldId]}
												onChange={(e) =>
													setUpdate((prev) => ({
														...prev,
														[id]: {
															// eslint-disable-next-line @typescript-eslint/ban-ts-comment
															// @ts-expect-error
															...update[id],
															[fieldId]:
																e.target.value,
														},
													}))
												}
											/>
										</label>
									);
								}
								if (type === "select") {
									return (
										<label
											className={s.label}
											key={fieldId}
										>
											<div>
												{fieldId}
												{required ? (
													<span
														className={s.required}
													>
														{" "}
														*
													</span>
												) : null}
											</div>
											<Select
												options={options?.map(
													(item) => {
														if (
															Array.isArray(
																item
															) &&
															item.length === 2
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
										<label className={s.flex} key={fieldId}>
											<div>
												{fieldId}
												{required ? (
													<span
														className={s.required}
													>
														{" "}
														*
													</span>
												) : null}
											</div>
											<Switch
												value={Boolean(
													update[id][fieldId]
												)}
												onChange={(e) =>
													setUpdate((prev) => ({
														...prev,
														[id]: {
															// eslint-disable-next-line @typescript-eslint/ban-ts-comment
															// @ts-expect-error
															...update[id],
															[fieldId]: e
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
									<label className={s.flex} key={fieldId}>
										<div>
											{required ? (
												<span className={s.required}>
													*{" "}
												</span>
											) : null}
											{fieldId}
										</div>{" "}
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
														[fieldId]:
															e.target.value,
													},
												}))
											}
										/>
									</label>
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
	);
};
