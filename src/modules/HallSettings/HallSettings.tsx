import { Route, Routes, useLocation, useNavigate } from "react-router";
import s from "./HallSettings.module.scss";
import { useMutation } from "react-query";
import { HallSettingsInit } from "../../data";
import { useEffect, useState } from "react";
import { Button as ButtonNav, Dropdown, Skeleton } from "antd";
import { NavLink } from "react-router-dom";
import {
	BalanceSettings,
	HallGameSettings,
	HallPlayersSessions,
	HallPlayersSessionsLogs,
	HallPlayersSettings,
	HallRtpSettings,
	HallTestApiSettings,
	MainHallSettings,
} from "../../components/";

type AccessButtonProps = {
	label: string;
	items?: { key: string; label: string }[];
};

export const HallSettings = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { mutate, isLoading: isLoadingButtons } =
		useMutation(HallSettingsInit);

	const [accessButtons, setAccessButtons] = useState<
		AccessButtonProps[] | []
	>([]);

	useEffect(() => {
		const currentId = pathname.split("/")[3];

		if (Number.isNaN(Number(currentId))) {
			navigate("/dashboard");
		}

		if (accessButtons.length) return;

		mutate(
			{ hallId: currentId },
			{
				onSuccess: ({ data }) => {
					if (data.error) return;
					Object.entries(data.content.access).map(([key, value]) => {
						if (
							Object.values(value as Record<string, object>)
								.length > 0
						) {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							return setAccessButtons((prev) => [
								...prev,
								{
									label: key,
									items: Object.keys(
										value as Record<string, object>
									)
										.filter((val) => val !== "activ")
										.map((val) => {
											return {
												key: val,
												label: (
													<NavLink
														to={`${currentId}/${key}/${val}`}
													>
														{val}
													</NavLink>
												),
											};
										}),
								},
							]);
						}

						setAccessButtons((prev) => [
							...prev,
							{
								label: key,
							},
						]);
					});
					// if (Number.isInteger(Number(pathname.split("/").at(-1)))) {
					// 	navigate(
					// 		`${currentId}/${
					// 			Object.keys(data.content.access)[0]
					// 		}`
					// 	);
					// }
				},
			}
		);
	}, []);

	return (
		<div className={s.container}>
			<div className={s.header}>
				{!accessButtons.length && isLoadingButtons ? (
					<>
						<Skeleton.Button
							active={isLoadingButtons}
							style={{ width: "80px" }}
						/>
						<Skeleton.Button
							active={isLoadingButtons}
							style={{ width: "80px" }}
						/>
						<Skeleton.Button
							active={isLoadingButtons}
							style={{ width: "80px" }}
						/>
					</>
				) : null}
				{accessButtons.map(({ label, items }) => (
					<div key={label}>
						{items?.length ? (
							<Dropdown menu={{ items }}>
								<ButtonNav>{label}</ButtonNav>
							</Dropdown>
						) : (
							<NavLink to={`${pathname.split("/")[3]}/${label}`}>
								<ButtonNav>{label}</ButtonNav>
							</NavLink>
						)}
					</div>
				))}
			</div>
			<div>
				<div className={s.settings}>
					<Routes>
						<Route
							path="/:id/settings"
							element={<MainHallSettings />}
						/>
						<Route
							path="/:id/callback/callback"
							element={<MainHallSettings />}
						/>
						<Route
							path="/:id/callback/testApi"
							element={<HallTestApiSettings />}
						/>
						<Route
							path="/:id/games/settings"
							element={<MainHallSettings />}
						/>
						<Route
							path="/:id/games/providers"
							element={<HallGameSettings />}
						/>
						<Route
							path="/:id/games/balance"
							element={<BalanceSettings />}
						/>
						<Route
							path="/:id/players"
							element={<HallPlayersSettings />}
						/>
						<Route
							path="/:id/players/:id"
							element={<HallPlayersSessions />}
						/>
						<Route
							path="/:id/players/:id/:id"
							element={<HallPlayersSessionsLogs />}
						/>
						<Route path="/:id/rtp" element={<HallRtpSettings />} />
					</Routes>
					{/* <HallModulesSettings /> */}
				</div>
			</div>
		</div>
	);
};
