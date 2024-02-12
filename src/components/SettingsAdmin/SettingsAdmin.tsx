import { Input, Select, Switch } from "antd";
import s from "./SettingsAdmin.module.scss";
import { ProfileSettings } from "../../data";
import { useMutation } from "react-query";
import { useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";

type SettingsProps = {
	id: string;
	type: string;
	value: string;
	options?: string[];
};

export const SettingsAdmin = () => {
	const { mutate, isLoading } = useMutation(ProfileSettings);

	const [settings, setSettings] = useState<SettingsProps[] | []>([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});

	useEffect(() => {
		mutate(
			{},
			{
				onSuccess: (data) => {
					setSettings(data.data.content);
				},
			}
		);
	}, []);

	if (!settings?.length) {
		return (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		);
	}

	const handleSubmitForm = () => {
		mutate(
			{
				update,
			},

		);
	};

	return (
		<div className={s.container}>
			<div className={s.form}>
				{settings.map(({ id, options, type, value }: SettingsProps) => {
					if (type === "input" || type === "text") {
						return (
							<label className={s.label} key={id}>
								{id}
								<Input
									disabled={type === "text"}
									value={update[id] ? update[id] : value}
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
									options={options?.map((item) => {
										if (
											Array.isArray(item) &&
											item.length === 2
										) {
											const [label, value] = item;
											return { label, value };
										}
										return { label: item, value: item };
									})}
									value={update[id] ? update[id] : value}
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
							<label className={s.flex} key={id}>
								{id}
								<Switch
									value={
										update[id]
											? Boolean(value[id])
											: Boolean(value)
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
						<label className={s.flex} key={id}>
							{id}
							<input type={type} value={value} />
						</label>
					);
				})}
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
