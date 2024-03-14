import s from "./Home.module.scss";
import { Navigate, Route, Routes } from "react-router";
import {
	Sidebar,
	SettingsAdmin,
	NavBar,
	BalanceSettings,
	RtpTable,
	CreateAgent,
	Search,
	CurrencySettings,
	AgentsTotal,
	StatisticTable,
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
					<Route path="/statistic" element={<AgentsTotal />} />
					<Route path="/statistic/*" element={<StatisticTable />} />
					<Route path="/hall-settings/*" element={<HallSettings />} />
					<Route path="/search" element={<Search />} />
					<Route
						path="/my-balance"
						element={<CurrencySettings isHiddenActions />}
					/>
					<Route
						path="/my-balance/*"
						element={<BalanceSettings isHiddenActions />}
					/>
					<Route path="/create-agent" element={<CreateAgent />} />
					<Route
						path="/agent/:id/settings"
						element={<AgentSettings />}
					/>
					<Route
						path="/agent/:id/balance/*"
						element={<BalanceSettings />}
					/>
					<Route path="/rtp" element={<RtpTable />} />
					<Route path="/settings" element={<SettingsAdmin />} />
				</Routes>
			</div>
		</div>
	);
};
