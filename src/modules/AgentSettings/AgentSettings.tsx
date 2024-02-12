import { Tabs } from "antd";
import {
	ProfileSettings,
	CurrencySettings,
	GameSettings,
	AgentHallSettings,
} from "../../components";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";

export const AgentSettings = () => {
	const [key, setKey] = useState("profile");
	const { pathname } = useLocation();

	useEffect(() => {
		setKey("profile");
	}, [pathname]);

	return (
		<>
			<Tabs
				onChange={(e) => setKey(e)}
				activeKey={key}
				type="card"
				items={[
					{
						label: "Profile",
						key: "profile",
						children: (
							<>
								<ProfileSettings />
							</>
						),
					},
					{
						label: "Settings",
						key: "settings",
						children: (
							<>
								<AgentHallSettings />
							</>
						),
					},
					{
						label: "Currency",
						key: "currency",
						children: (
							<>
								<CurrencySettings />
							</>
						),
					},
					{
						label: "Game settings",
						key: "gameSettings",
						children: (
							<>
								<GameSettings />
							</>
						),
					},
				]}
			/>
		</>
	);
};
