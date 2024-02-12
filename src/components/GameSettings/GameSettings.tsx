import s from "./GameSettings.module.scss";
import { AgentGameSettings, useProfileStore } from "../../data";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { SetStateAction, useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";
import { Switch, Input } from "antd";

type SettingsProps = {
	id: number;
	activ: number;
	name: string;
	rate: number;
	child: [];
};

export const GameSettings = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { mutate, isLoading } = useMutation(AgentGameSettings);
	const { userInfo } = useProfileStore();

	const [settings, setSettings] = useState<SettingsProps[] | []>([]);
	const [stack, setStack] = useState<
		{ id: number; rate: number; activ: number }[]
	>([]);
	useEffect(() => {
		const currentId = pathname.split("/").at(-2);
		if (currentId === String(userInfo?.id)) {
			return navigate("/dashboard/settings");
		}
		mutate(
			{ id: currentId },
			{
				onSuccess: (res) => {
					setSettings(res.data.content);
					const result: SettingsProps[] = [];
					res.data.content.map(
						({ id, activ, rate, child }: SettingsProps) => {
							if (child && child.length) {
								child.map((item: SettingsProps) => {
									const { id, activ, rate } = item;
									result.push({
										id,
										activ,
										rate,
									} as SettingsProps);
								});
							}
							result.push({ id, activ, rate } as SettingsProps);
						}
					);
					setStack(
						result as SetStateAction<
							{ id: number; rate: number; activ: number }[]
						>
					);
				},
			}
		);
	}, [pathname]);

	if (!settings) {
		return (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		);
	}

	const handleChange = ({
		id,
		activ,
		rate,
	}: {
		id: number;
		activ?: number;
		rate?: number;
	}) => {
		const current = stack.findIndex((item) => item.id === id);
		if (activ !== undefined) {
			const { id, rate } = stack[current];
			const newArr = [
				...stack.slice(0, current),
				{ id, activ, rate },
				...stack.slice(current + 1),
			];
			setStack(newArr);
		}

		if (rate !== undefined) {
			const { id, activ } = stack[current];
			const newArr = [
				...stack.slice(0, current),
				{ id, activ, rate },
				...stack.slice(current + 1),
			];
			setStack(newArr);
		}
	};

	const handleSubmitForm = () => {
		const currentId = pathname.split("/").at(-2);

		mutate(
			{
				id: currentId,
				update: stack,
			},
		);
	};

	return (
		<div className={s.container}>
			<div className={s.form}>
				{settings.map(({ id, child, name }) => (
					<div key={id}>
						<div className={s.grid}>
							<span>{name}</span>
							<Switch
								value={Boolean(
									stack.find((item) => item.id === id)?.activ
								)}
								onChange={(e) =>
									handleChange({
										id,
										activ: e ? 1 : 0,
									})
								}
							/>
						</div>
						<div>
							{child.map(({ id, name }) => (
								<div
									key={id}
									className={s.grid}
									style={{ marginLeft: "50px" }}
								>
									<span>{name}</span>
									<Switch
										value={Boolean(
											stack.find(
												(item: { id: number }) =>
													item.id === id
											)?.activ
										)}
										onChange={(e) =>
											handleChange({
												id,
												activ: e ? 1 : 0,
											})
										}
									/>
									<Input
										value={
											stack.find((item) => item.id === id)
												?.rate
										}
										style={{ width: "50px" }}
										onChange={(e) =>
											handleChange({
												id,
												rate: Number(e.target.value),
											})
										}
									/>
								</div>
							))}
						</div>
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
