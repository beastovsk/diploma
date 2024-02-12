import s from "./Home.module.scss";
import { Navigate, Route, Routes } from "react-router";
import {
	Sidebar,
	StatisticTable,
	SettingsAdmin,
	NavBar,
	BalanceSettings,
} from "../../components";
import { AgentSettings, HallSettings } from "..";

export const Home = () => {
	return (
		<div className={s.container}>
			<Sidebar />
			<div className={s.content}>
				<NavBar />
				<Routes>
					<Route
						path="/"
						element={<Navigate to="/dashboard/statistic" />}
					/>
					<Route
						path="/statistic/*"
						element={
							<>
								<StatisticTable />
							</>
						}
					/>
					<Route
						path="/hall-settings/*"
						element={
							<>
								<HallSettings />
							</>
						}
					/>
					<Route path="/my-balance" element={<>/my-balance</>} />
					<Route path="/create-agent" element={<>/create-agent</>} />
					<Route
						path="/agent/:id/settings"
						element={<AgentSettings />}
					/>
					<Route
						path="/agent/:id/balance/*"
						element={<BalanceSettings />}
					/>
					<Route path="/rtp" element={<>/rtp</>} />
					<Route path="/settings" element={<SettingsAdmin />} />
				</Routes>
			</div>
		</div>
	);
};
