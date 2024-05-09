import { Form, Input, Radio, Space } from "antd";
import s from "./form.module.scss";
import { customNotification } from "../../utils/customNotification";

export const Firstform = () => {
	const [form] = Form.useForm();

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

	const handleFormSubmit = (values) => {
		sendDataToBackend(values);
	};

	return (
		<div className={s.container}>
			<div className={s.wrapper}>
				<div>
					<h1>C homeline всегда ВЫГОДНЕЕ</h1>
					<p>1 месяц БЕСПЛАТНО при оплате за 12ый месяц</p>
				</div>
				<div>
					<Form
						form={form}
						onFinish={handleFormSubmit}
						className={s.form}
					>
						<Space
							direction="horizontal"
							style={{ display: "flex", marginBottom: "20px" }}
						>
							<Form.Item name="name" className={s.formItem}>
								<Input placeholder="Ваше ФИО" />
							</Form.Item>
							<Form.Item name="phone" className={s.formItem}>
								<Input placeholder="0(999)99-99-99" />
							</Form.Item>
						</Space>
						<button
							type="submit"
							className={`${s.button} ${s.activeButton}`}
						>
							Далее
						</button>
					</Form>
				</div>
			</div>
		</div>
	);
};
