import { Input } from "antd";
import s from "./SettingsAdmin.module.scss";
import { ProfileSettings } from "../../data";
import { useMutation } from "react-query";
import { useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";

type SettingsProps = {
	id: string;
	edit: number;
	value: string;
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
		mutate({
			update,
		});
	};

	return (
		<div className={s.container}>
			<div className={s.form}>
				{settings.map(({ id, edit, value }: SettingsProps) => {
					return (
						<label className={s.label} key={id}>
							{id}
							<Input
								disabled={!edit}
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
