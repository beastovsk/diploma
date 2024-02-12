import { Input, Select, Switch } from "antd";
import s from "./ProfileSettings.module.scss";
import { AgentSettings, useProfileStore } from "../../data";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";

type SettingsProps = {
	id: string;
	type: string;
	value: string;
	options?: string[];
};

export const ProfileSettings = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { mutate, isLoading } = useMutation(AgentSettings);
	const { userInfo } = useProfileStore();

	const [settings, setSettings] = useState<SettingsProps[] | []>([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});

	useEffect(() => {
		const currentId = pathname.split("/").at(-2);
		if (currentId === String(userInfo?.id)) {
			return navigate("/dashboard/settings");
		}
		mutate(
			{ id: currentId, settings: ["profile"] },
			{
				onSuccess: (data) => {
					setSettings(data.data.content[0]?.elements);
				},
			}
		);
	}, [pathname]);

	if (!settings?.length) {
		return (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		);
	}

	const handleSubmitForm = () => {
		const currentId = pathname.split("/").at(-2);

		mutate({
			id: currentId,
			settings: ["profile"],
			update: {
				profile: update,
			},
		});
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
											const [value, label] = item;
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
						<label className={s.label} key={id}>
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
