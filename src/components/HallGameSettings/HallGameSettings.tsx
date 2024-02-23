import { Switch, Input } from "antd";
import { Button } from "../../shared";
import s from "./HallGameSettings.module.scss";
import { SetStateAction, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { HallSettingsGames } from "../../data";
import { useLocation } from "react-router";

type SettingsContent = {
	id: string;
	name: string;
	activ: number;
	child?: { id: string; name: string; activ: number; rate: string }[];
};

export const HallGameSettings = () => {
	const { pathname } = useLocation();
	const [games, setGames] = useState([]);
	const [update, setUpdate] = useState<{ [id: string]: string | number }>({});
	const { mutate: gameSettingsMutate, isLoading: isGameLoading } =
		useMutation(HallSettingsGames);

	useEffect(() => {
		const currentId = pathname.split("/")[3];
		const currentPath = pathname.split("/")[4];
		const currentCategory = pathname.split("/")[5];

		setGames([]);
		setUpdate({});

		if (
			Number.isNaN(Number(currentId)) ||
			currentPath !== "games" ||
			currentCategory === "balance" ||
			currentCategory === "settings"
		)
			return;
		const settings = pathname.split("/").at(-1);

		return gameSettingsMutate(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			{ id: currentId, action: settings },
			{
				onSuccess: ({ data }) => {
					const currentItem: SetStateAction<{
						[id: string]: string | number;
					}> = {};
					const providersUpdate = [];

					data.content.map(
						({ id, name, activ, child }: SettingsContent) => {
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
						}
					);

					setGames(
						data.content.map(
							({ id, name, activ, child }: SettingsContent) => ({
								id,
								name,
								activ,
								child: child?.map(
									({ id, name, activ, rate }) => ({
										id,
										name,
										activ,
										rate,
									})
								),
							})
						)
					);

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

	const handleSubmitGames = () => {
		const currentId = pathname.split("/")[3];
		const action = pathname.split("/").at(-1);

		gameSettingsMutate(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			{ id: currentId, action, update }
		);
	};

	return (
		<>
			{games.length && update ? (
				<div className={s.container}>
					<div className={s.wrapper}>
						{games.map(
							({
								id: gameId,
								activ: gameActiv,
								name,
								child,
							}: SettingsContent) => {
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
																(item: {
																	id: string;
																}) =>
																	gameId ==
																	item.id
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

																const prevElems =
																	[
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

																return [
																	...prevElems,
																	{
																		id: gameId,
																		activ: val
																			? 1
																			: 0,
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
																		}) =>
																			gameId ==
																			id
																	)
																	.child.find(
																		(child: {
																			id: string;
																		}) =>
																			id ==
																			child.id
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

																		const prevElems =
																			[
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
																		}) =>
																			gameId ==
																			id
																	)
																	.child.find(
																		(child: {
																			id: string;
																		}) =>
																			id ==
																			child.id
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
																				({
																					id,
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

																		const prevElems =
																			[
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
							}
						)}
					</div>
					<Button
						isLoading={isGameLoading}
						type="primary"
						size="large"
						onClick={() => handleSubmitGames()}
					>
						Отправить
					</Button>
				</div>
			) : null}
		</>
	);
};
