import { Banner } from "../../components/Banner/Banner";
import { Header } from "../../components/Header/Header";
import { Plans } from "../../components/Plans/Plans";
import { Firstform } from "../../components/FirstForm/Firstform";
import { Advantages } from "../../components/Advantages/Advantages";
import { Info } from "../../components/info/info";
import { Modal } from "../../shared/Modal";
import { useStore } from "../../components/store";
import { customNotification } from "../../utils/customNotification";
import { Form, Input } from "antd";

import s from "./Home.module.scss";

export const Home = () => {
	const [form] = Form.useForm();
	const { open, setOpen } = useStore();

	const sendDataToBackend = async (data) => {
		try {
			const response = await fetch("http://localhost:3005/api/form", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();

			if (!responseData) return;

			setOpen(false);
			form.resetFields();
			customNotification(
				"success",
				"top",
				"Данные отправлены",
				"Мы свяжемся с вами"
			);
			console.log(responseData);
		} catch (error) {
			console.error("Ошибка при отправке данных на бэкенд:", error);
		}
	};
	return (
		<div>
			<Header />
			<Banner />
			<Plans />
			<Firstform />
			<Advantages />
			<Firstform />
			<Info />

			<Modal open={open} setOpen={setOpen} header="Оставить заявку">
				<h2 className={s.title}>И мы с Вами свяжемся</h2>
				<Form
					form={form}
					className={s.form}
					onFinish={(value) => sendDataToBackend(value)}
				>
					<Form.Item name="name" className={s.formItem}>
						<Input placeholder="Ваше ФИО" className={s.input} />
					</Form.Item>
					<Form.Item name="phone">
						<Input
							placeholder="0(999)99-99-99"
							className={s.input}
						/>
					</Form.Item>

					<h2 className={s.text}>
						Нажав кнопку отправить, вы даёте согласие на
						использование ваших личных данных указанных в форме
					</h2>

					<button className={s.button}>Отправить</button>
				</Form>
			</Modal>
		</div>
	);
};
