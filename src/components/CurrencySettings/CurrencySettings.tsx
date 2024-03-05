import { Select, Switch } from "antd";
import s from "./CurrencySettings.module.scss";
import { AgentSettings, BalanceInfo, useProfileStore } from "../../data";
import { useMutation } from "react-query";
import { useLocation } from "react-router";
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

export const CurrencySettings = ({
	isHiddenActions = false,
}: {
	isHiddenActions: boolean;
}) => {
	const { pathname } = useLocation();
	const { mutate, isLoading } = useMutation(AgentSettings);
	const { mutate: getBalance, isLoading: isBalanceLoading } =
		useMutation(BalanceInfo);
	const { userInfo } = useProfileStore();
	const [settings, setSettings] = useState<SettingsProps>(
		{} as SettingsProps
	);
	const [currency, setCurrency] = useState("");
	const page = pathname.split("/").at(-1);
	const id = pathname.split("/").at(-2);
	const isPersonalBalance = page === "my-balance";

	useEffect(() => {
		if (!userInfo.id) return;

		if (isPersonalBalance) {
			return getBalance(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				{},
				{
					onSuccess: (res) => {
						console.log(res);
						handleParseResponse(res);
					},
				}
			);
		}
		mutate(
			{ id, settings: ["currency"] },
			{
				onSuccess: (res) => {
					handleParseResponse(res);
				},
			}
		);
	}, [pathname, userInfo]);

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
		mutate(
			{
				id,
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
						{ id, settings: ["currency"] },
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

	if (!settings) {
		return (
			<div className="loader">
				<img src={loader} width={50} height={50} />
			</div>
		);
	}

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

				{!isHiddenActions ? (
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
				) : null}
			</div>

			{!isHiddenActions ? (
				<Button
					isLoading={isLoading || isBalanceLoading}
					type="primary"
					size="large"
					onClick={() => handleSubmitForm()}
				>
					Отправить
				</Button>
			) : null}
		</div>
	);
};
