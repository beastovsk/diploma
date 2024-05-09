import "./App.css";
import { Home } from "./modules";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
	// const [contextHolder] = notification.useNotification();
	const theme = {
		token: {
			// colorPrimary: "#1677FF",
			// borderRadius: 5,
			// colorBgBase: "#5B5B5B",
			// colorBgContainer: "#FFFFFF33",
			// colorBorder: "#FFFFFF33",
			// colorText: "#fff",
			// colorIcon: "#fff",
		},
	};
	const queryClient = new QueryClient();

	return (
		<ConfigProvider theme={theme}>
			{/* <>{contextHolder}</> */}
			<QueryClientProvider client={queryClient}>
				<Home />
			</QueryClientProvider>
		</ConfigProvider>
	);
}

export default App;
