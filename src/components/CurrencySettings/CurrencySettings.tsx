import { Select, Switch } from "antd";
import s from "./CurrencySettings.module.scss";
import { AgentSettings, useProfileStore } from "../../data";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { SetStateAction, useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";
import { NavLink } from "react-router-dom";

type SettingsProps = {
	currencyList: {
		label: string;
		balance: string;
		activ: string;
	}[];
	canAdd: string[];
};

export const CurrencySettings = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { mutate, isLoading } = useMutation(AgentSettings);
	const { userInfo } = useProfileStore();

	const [settings, setSettings] = useState<SettingsProps>(
		{} as SettingsProps
	);
	const [currency, setCurrency] = useState("");

	useEffect(() => {
		const currentId = pathname.split("/").at(-2);
		if (currentId == String(userInfo?.id)) {
			return navigate("/dashboard/settings");
		}
		mutate(
			{ id: currentId, settings: ["currency"] },
			{
				onSuccess: (res) => {
					handleParseResponse(res);
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

	const handleParseResponse = (res: {
		data: { content: { elements: [] }[] };
	}) => {
		const currentItem: SettingsProps = {
			currencyList: [],
			canAdd: [],
		};

		res.data.content[0]?.elements?.map(
			({
				id,
				options,
				elements,
			}: {
				id: string;
				options: string[];
				elements: { value: string }[];
			}) => {
				if (options) {
					currentItem["canAdd"] = options.filter((item) => item);
					return;
				}
				const [balance, activ] = elements;
				currentItem.currencyList.push({
					label: id,
					balance: balance.value,
					activ: activ.value,
				});
			}
		);
		setSettings(currentItem as SetStateAction<SettingsProps>);
	};

	const handleSubmitForm = () => {
		const currentId = pathname.split("/").at(-2);

		mutate(
			{
				id: currentId,
				settings: ["currency"],
				update: {
					currency: {
						canAdd: currency,
					},
				},
			},
			{
				onSuccess: () => {
					mutate(
						{ id: currentId, settings: ["currency"] },
						{
							onSuccess: (res) => {
								handleParseResponse(res);
							},
						}
					);
				},
			}
		);
	};

	return (
		<div className={s.container}>
			<div className={s.form}>
				<div className={s.grid}>
					<span>currency</span>
					<span className={s.balance}>balance</span>
					<span>activ</span>
				</div>

				{settings.currencyList?.map(({ label, activ, balance }) => (
					<div className={s.grid}>
						<span>{label}</span>
						<NavLink
							to={{
								pathname: `${pathname
									.split("/")
									.slice(0, 4)
									.join("/")}/balance`,
								search: `currency=${label}`,
							}}
							className={s.balance}
						>
							{balance}
						</NavLink>
						<span>
							<Switch value={Boolean(activ)} />
						</span>
					</div>
				))}

				<div className={s.flex}>
					canAdd
					<Select
						value={currency}
						onChange={(e) => setCurrency(e)}
						options={settings?.canAdd?.map((currency) => ({
							label: currency,
							value: currency,
						}))}
					/>
				</div>
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
