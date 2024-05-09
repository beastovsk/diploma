import s from "./Header.module.scss";
import logo from "../../assets/images/logo.svg";

export const Header = () => {
	return (
		<>
			<div className={s.container}>
				<div className={s.wrapper}>
					<img src={logo} alt="" width={200} />
					<div>
						<span>FACE</span>
						<span>INST</span>
						<span>TG</span>
					</div>
					<div className={s.col}>
						<div className={s.row}>
							<span>+996 999 38 78 03</span>
							<span>подключение</span>
						</div>
						<div className={s.row}>
							<div className={s.colMin}>
								<span>+996 999 38 78 03</span>
								<span>+996 999 38 78 03</span>
							</div>
							<span>тех поддержка</span>
						</div>
					</div>
					<div className={s.row}>
						<div>
							<button className={s.button}>
								Стать абонентом
							</button>
						</div>
						<div>Личный кабинет</div>
						<div className={s.red}>RU</div>
					</div>
				</div>
			</div>{" "}
			<div className={s.nav}>Главная</div>
		</>
	);
};
