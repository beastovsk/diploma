import s from "./GameSettings.module.scss";
import { AgentGameSettings, useProfileStore } from "../../data";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { SetStateAction, useEffect, useState } from "react";
import loader from "../../assets/loader.svg";
import { Button } from "../../shared";
import { Switch, Input } from "antd";

export const GameSettings = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { mutate, isLoading } = useMutation(AgentGameSettings);
	const { userInfo } = useProfileStore();

	const [games, setGames] = useState([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});

	useEffect(() => {
		const currentId = pathname.split("/").at(-2);

		setGames([]);
		setUpdate({});

		if (currentId === String(userInfo?.id)) {
			return navigate("/dashboard/settings");
		}
		mutate(
			{ id: currentId },
			{
				onSuccess: ({ data }) => {
					setGames(
						data.content.map(({ id, name, activ, child }) => ({
							id,
							name,
							activ,
							child: child?.map(({ id, name, activ, rate }) => ({
								id,
								name,
								activ,
								rate,
							})),
						}))
					);
					const currentItem: SetStateAction<{
						[id: string]: string | number;
					}> = {};
					const providersUpdate = [];

					data.content.map(({ id, name, activ, child }) => {
						if (child) {
							providersUpdate.push({
								id,
								activ,
								child: child.map(({ id, activ, rate }) => ({
									id,
									activ,
									rate,
								})),
							});
						}
						currentItem[name] = activ;
					});
					setUpdate(
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						providersUpdate.length // eslint-disable-next-line @typescript-eslint/ban-ts-comment
							? providersUpdate
							: currentItem
					);
				},
			}
		);
	}, [pathname]);

	if (!games) {
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
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			update,
		});
	};

	return (
		<div className={s.container}>
			<div className={s.wrapper}>
				{games.map(({ id: gameId, activ: gameActiv, name, child }) => {
					if (child) {
						return (
							<div>
								<label
									className={s.label}
									style={{ width: "40%" }}
								>
									<h2>{name}</h2>
									<Switch
										value={
											update // eslint-disable-next-line @typescript-eslint/ban-ts-comment
												// @ts-expect-error
												.find(
													(item: { id: string }) =>
														gameId == item.id
												).activ == 1
												? true
												: false
										}
										onChange={(val) =>
											setUpdate(
												// eslint-disable-next-line @typescript-eslint/ban-ts-comment
												// @ts-expect-error
												(prev) => {
													const currentChilds = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														update.find(
															(item: {
																id: string;
															}) =>
																gameId ==
																item.id
														).child;

													const currentIndex = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														update.findIndex(
															(item: {
																id: string;
															}) =>
																gameId ==
																item.id
														);

													const prevElems = [
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														...prev.slice(
															0,
															currentIndex
														), // eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														...prev.slice(
															currentIndex + 1
														),
													];

													return [
														...prevElems,
														{
															id: gameId,
															activ: val ? 1 : 0,
															child: currentChilds,
														},
													];
												}
											)
										}
									/>
								</label>
								{child.map(
									({
										id,
										name,
										activ,
										rate,
									}: {
										id: string;
										name: string;
										activ: number;
										rate: string;
									}) => (
										<div className={s.item}>
											<div>{name}</div>
											<Switch
												value={
													update // eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														.find(
															({
																id,
															}: {
																id: string;
															}) => gameId == id
														)
														.child.find(
															(child: {
																id: string;
															}) => id == child.id
														).activ == 1
														? true
														: false
												}
												onChange={(val) =>
													setUpdate(
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														(prev) => {
															const currentChilds = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																update.find(
																	({
																		id,
																	}: {
																		id: string;
																	}) =>
																		gameId ==
																		id
																).child;
															const currentChildIndex =
																currentChilds.findIndex(
																	(child: {
																		id: string;
																	}) =>
																		child.id ===
																		id
																);
															const currentIndex = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																update.findIndex(
																	({
																		id,
																	}: {
																		id: string;
																	}) =>
																		gameId ==
																		id
																);

															const prevElems = [
																// eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																...prev.slice(
																	0,
																	currentIndex
																), // eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																...prev.slice(
																	currentIndex +
																		1
																),
															];
															const prevChildElems =
																[
																	...currentChilds.slice(
																		0,
																		currentChildIndex
																	),
																	...currentChilds.slice(
																		currentChildIndex +
																			1
																	),
																];

															return [
																...prevElems,
																{
																	id: gameId,
																	activ: gameActiv,
																	child: [
																		...prevChildElems,

																		{
																			id,
																			activ: val
																				? 1
																				: 0,
																			rate,
																		},
																	],
																},
															];
														}
													)
												}
											/>
											<Input
												value={
													update // eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														.find(
															({
																id,
															}: {
																id: string;
															}) => gameId == id
														)
														.child.find(
															(child: {
																id: string;
															}) => id == child.id
														).rate
												}
												onChange={(
													val: React.ChangeEvent<HTMLInputElement>
												) =>
													setUpdate(
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-expect-error
														(prev) => {
															const currentChilds = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																update.find(
																	({ id }) =>
																		gameId ==
																		id
																).child;
															const currentChildIndex =
																currentChilds.findIndex(
																	(child: {
																		id: string;
																	}) =>
																		child.id ===
																		id
																);
															const currentIndex = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																update.findIndex(
																	({
																		id,
																	}: {
																		id: string;
																	}) =>
																		gameId ==
																		id
																);

															const prevElems = [
																// eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																...prev.slice(
																	0,
																	currentIndex
																), // eslint-disable-next-line @typescript-eslint/ban-ts-comment
																// @ts-expect-error
																...prev.slice(
																	currentIndex +
																		1
																),
															];
															const prevChildElems =
																[
																	...currentChilds.slice(
																		0,
																		currentChildIndex
																	),
																	...currentChilds.slice(
																		currentChildIndex +
																			1
																	),
																];

															return [
																...prevElems,
																{
																	id: gameId,
																	activ: gameActiv,
																	child: [
																		...prevChildElems,

																		{
																			id,
																			activ,
																			rate: val
																				.target
																				.value,
																		},
																	],
																},
															];
														}
													)
												}
											/>
										</div>
									)
								)}
							</div>
						);
					}
					return (
						<div className={s.label}>
							{name}
							<Switch
								value={Boolean(update[name])}
								onChange={(val) =>
									setUpdate((prev) => ({
										...prev,
										[name]: val ? 1 : 0,
									}))
								}
							/>
						</div>
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
