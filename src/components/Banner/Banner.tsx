import s from "./Banner.module.scss";
import banner from "../../assets/images/banner.png";

export const Banner = () => {
	return (
		<div className={s.container}>
			<img src={banner} />
		</div>
	);
};
