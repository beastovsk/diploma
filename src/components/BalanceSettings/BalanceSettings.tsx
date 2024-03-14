import { DatePicker, Empty, Input, Radio, notification } from "antd";
import { Button } from "../../shared";
import s from "./BalanceSettings.module.scss";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import {
	BalanceOperation,
	HallSettingsBalance,
	useProfileStore,
} from "../../data";
import { useLocation } from "react-router";
import dayjs from "dayjs";

import loader from "../../assets/loader.svg";

type BalanceSettingsProps = {
	isHiddenActions?: boolean;
};

type AccountProps = {
	id: string;
	group: string;
	login: string;
	currency: string;
	balances: { currency: string; balance: number }[];
};

type RequestBalanceOperation = {
	id: string;
	operation: string;
	cash: string;
	data: { comment: string };
};

type LogsProps = {
	id: string;
	operation: string;
	currency: string;
	cash: string;
	before: string;
	status: string;
	dateTime: string;
	data: { comment: string };
};

const getDate = (pos, date = new Date()) => {
	const current = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "2-digit",
	}).format(date);
	return `${date.getFullYear()}-${current.split("/").join("-")} ${
		pos === "from" ? "00:00" : "23:59"
	}`;
};

export const BalanceSettings = ({
	isHiddenActions = false,
}: BalanceSettingsProps) => {
	const { pathname, search } = useLocation();
	const [account, setAccount] = useState({} as AccountProps);
	const [filterDate, setFilterDate] = useState(["", ""]);
	const [logs, setLogs] = useState([]);
	const [update, setUpdate] = useState({
		operation: "in",
		cash: "",
		data: { comment: "" },
	} as RequestBalanceOperation);
	const [isBlockedActions, setIsBlockedActions] = useState(isHiddenActions);
	const { userInfo } = useProfileStore();
	const { mutate, isLoading } = useMutation(HallSettingsBalance);
	const { mutate: operationMutate, isLoading: isOperationLoading } =
		useMutation(BalanceOperation);
	const id = useMemo(() => {
		return pathname.split("/")[2] === "my-balance"
			? String(userInfo.id)
			: pathname.split("/")[3];
	}, [userInfo.id]);
	const [api, contextHolder] = notification.useNotification();

	useEffect(() => {
		const currency = search.split("=")[1];
		if (!userInfo.id) return;

		setAccount({} as SetStateAction<AccountProps>);
		setUpdate({} as SetStateAction<RequestBalanceOperation>);

		mutate(
			{
				id,
				date: filterDate.includes("")
					? [getDate("from"), getDate("to")]
					: filterDate,
				currency,
			},
			{
				onSuccess: ({ data }) => {
					const { account, logs } = data.content;
					setUpdate({
						id: account.id,
						operation: "in",
					} as RequestBalanceOperation);
					setAccount(account);
					setLogs(logs);
				},
			}
		);
	}, [pathname, userInfo.id]);

	const openNotification = (content: { error?: string }) => {
		const { error } = content;

		api.info({
			message: error ? "Error" : "Success",
			description: error ? error : "",
			placement: "topRight",
		});
	};

	const handleSubmitOperation = () => {
		const currency = search.split("=")[1];

		if (Object.keys(update).length < 3) return;
		const data = { ...update, currency };

		operationMutate(data as RequestBalanceOperation, {
			onSuccess: ({ data }) => {
				if (data.error) {
					openNotification({ error: data.error });
					return setIsBlockedActions(true);
				}
				setUpdate({} as SetStateAction<RequestBalanceOperation>);
				mutate(
					{
						id,
						date: filterDate.includes("")
							? [getDate("from"), getDate("to")]
							: filterDate,
						currency,
					},
					{
						onSuccess: ({ data }) => {
							const { account, logs } = data.content;
							setUpdate({
								id: account.id,
							} as RequestBalanceOperation);
							setAccount(account);
							setLogs(logs);
						},
					}
				);
			},
		});
	};

	const handleFilterLogs = () => {
		const currentId = pathname.split("/")[3];
		const currency = search.split("=")[1];

		mutate(
			{
				id: currentId,
				date: filterDate.includes("")
					? [getDate("from"), getDate("to")]
					: filterDate,
				currency,
			},
			{
				onSuccess: ({ data }) => {
					const { account, logs } = data.content;
					setUpdate({
						id: account.id,
						operation: "in",
					} as RequestBalanceOperation);
					setAccount(account);
					setLogs(logs);
				},
			}
		);
	};

	return Object.keys(account).length ? (
		<div className={s.container}>
			{contextHolder}
			<div className={s.account}>
				<label className={s.label}>
					Login
					<span>{account.login}</span>
				</label>
				<label className={s.label}>
					Balance
					<div>
						{account.balances.map(({ balance, currency }) => (
							<div>
								{balance} {currency}
							</div>
						))}
					</div>
				</label>

				{!isBlockedActions ? (
					<>
						<label className={s.label}>
							Operation
							<Radio.Group
								defaultValue={"in"}
								value={update.operation}
								onChange={(e) =>
									setUpdate((prev) => ({
										...prev,
										operation: e.target.value,
									}))
								}
							>
								<Radio value={"in"} defaultChecked>
									In
								</Radio>
								<Radio value={"out"}>Out</Radio>
							</Radio.Group>
						</label>
						<label className={s.label}>
							Amount
							<Input
								value={update.cash}
								type="number"
								suffix={account.currency}
								onChange={(e) =>
									setUpdate((prev) => ({
										...prev,
										cash: e.target.value,
									}))
								}
							/>
						</label>
						<label className={s.label}>
							Comment
							<Input.TextArea
								value={update.data?.comment}
								style={{ height: 120, resize: "none" }}
								onChange={(e) =>
									setUpdate((prev) => ({
										...prev,
										data: { comment: e.target.value },
									}))
								}
							/>
						</label>

						<Button
							size="large"
							type="primary"
							onClick={handleSubmitOperation}
							isLoading={isOperationLoading}
						>
							Отправить
						</Button>
					</>
				) : null}
			</div>
			<div className={s.logs}>
				<div className={s.header}>
					<DatePicker
						value={
							filterDate.includes("")
								? dayjs(getDate("from"))
								: dayjs(filterDate[0].slice(0, 10))
						}
						onChange={(e) =>
							setFilterDate((prev) => [
								getDate("from", new Date(e.$d)),
								prev[1] ? prev[1] : getDate("to", new Date()),
							])
						}
					/>
					<DatePicker
						value={
							filterDate.includes("")
								? dayjs(getDate("to"))
								: dayjs(filterDate[1].slice(0, 10))
						}
						onChange={(e) =>
							setFilterDate((prev) => [
								prev[0] ? prev[0] : getDate("from", new Date()),
								getDate("to", new Date(e.$d)),
							])
						}
					/>
					<Button onClick={handleFilterLogs}>Показать</Button>
				</div>
				<div className={s.table}>
					<div className={`${s.row} ${s.rowHeader}`}>
						<p>#</p>
						<p>Operation</p>
						<p>Currency</p>
						<p>Amount</p>
						<p>Before</p>
						<p>Initator</p>
						<p>Date time</p>
						<p>Details</p>
					</div>
					<div className={s.content}>
						{logs.length ? (
							logs.map(
								({
									id,
									operation,
									currency,
									cash,
									before,
									status,
									dateTime,
									data,
								}: LogsProps) => (
									<div className={s.row}>
										<p>{id}</p>
										<p>{operation}</p>
										<p>{currency}</p>
										<p>{cash}</p>
										<p>{before}</p>
										<p>{status}</p>
										<p>{dateTime}</p>
										<p>{data ? data?.comment : ""}</p>
									</div>
								)
							)
						) : (
							<Empty description="Нет операций" />
						)}
					</div>
				</div>
			</div>
		</div>
	) : isLoading ? (
		<div className="loader">
			<img src={loader} width={30} height={30} />
		</div>
	) : null;
};
