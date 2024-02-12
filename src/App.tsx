import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authorization, Home } from "./modules";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { useProfileStore } from "./data";

const Redirect = () => {
	return <Navigate to="/log-in" />;
};

function App() {
	const { token } = useProfileStore();

	const redirect = token ? <Navigate to="/dashboard" /> : <Redirect />;
	const theme = {
		token: {
			colorPrimary: "#1677FF",
			borderRadius: 5,
			colorBgBase: "#5B5B5B",
			colorBgContainer: "#FFFFFF33",
			colorBorder: "#FFFFFF33",
			colorText: "#fff",
			colorIcon: "#fff",
		},
	};
	const queryClient = new QueryClient();

	return (
		<ConfigProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<HashRouter>
					<Routes>
						<Route path="/" element={redirect} />
						<Route
							path="/dashboard/*"
							element={token ? <Home /> : <Redirect />}
						/>
						<Route path="/log-in" element={<Authorization />} />
						{/* <Route path="/sign-up" element={<Register />} /> */}
					</Routes>
				</HashRouter>
			</QueryClientProvider>
		</ConfigProvider>
	);
}

export default App;
