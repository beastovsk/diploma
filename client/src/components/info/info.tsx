import s from "./info.module.scss";
import img from "../../assets/images/call.jpg";
import { useStore } from "../store";

export const Info = () => {
	const { setOpen } = useStore();

	return (
		<div className={s.container}>
			<div>
				<img src={img} alt="Интернет-сервис" className={s.image} />
			</div>
			<div>
				<h2 className={s.title}>Подключите интернет</h2>
				<p className={s.text}>
					Оставьте Заявку на бесплатное подключение* по Кыргызстану!
					<br /> Выгодные тарифы, сеть построенная на оборудовании
					премиум
					<br /> класса, круглосуточная техническая поддержка,
					интересные акции.
				</p>
				<button
					type="submit"
					onClick={() => setOpen(true)}
					className={`${s.button} ${s.activeButton}`}
				>
					Оформить заявку
				</button>
			</div>
		</div>
	);
};
