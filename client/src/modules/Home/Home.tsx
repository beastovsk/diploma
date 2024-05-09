import { Banner } from "../../components/Banner/Banner";
import { Header } from "../../components/Header/Header";
import { Plans } from "../../components/Plans/Plans";
import { Firstform } from "../../components/FirstForm/Firstform";
import { Advantages } from "../../components/Advantages/Advantages"
import { Info } from "../../components/info/info"

export const Home = () => {
	return (
		<div>
			<Header />
			<Banner />
			<Plans />
			<Firstform />
			<Advantages />
			<Firstform />
			<Info />
		</div>
	);
};
