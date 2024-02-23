import { Form, Input, notification } from "antd";
import { Button } from "../../shared";
import { useNavigate } from "react-router";
import { useMutation } from "react-query";
import { AgentCreate, useProfileStore } from "../../data";

import s from "./CreateAgent.module.scss";

export const CreateAgent = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { mutate: addAgent } = useMutation(AgentCreate);
	const { userInfo } = useProfileStore();
	const [api, contextHolder] = notification.useNotification();

	const openNotification = ({ message, description }) => {
		api.open({
			message,
			description
				,
		});
	};

	const handleSubmitCreateUser = async (data: {
		login: string;
		password: string;
	}) => {
		form.resetFields();

		addAgent(
			{ parent: userInfo?.id, ...data },
			{
				onSuccess: (res) => {
					if (res.data.error) {
						return openNotification({
							message: "Error",
							description: res.data.error,
						});
					}
					const id = res.data.content.id;
					navigate(`/dashboard/agent/${id}/settings`);
				},
			}
		);
	};

	return (
		<div className={s.container}>
			{contextHolder}
			<h3>Create agent</h3>
			<Form
				onFinish={handleSubmitCreateUser}
				layout="vertical"
				form={form}
				initialValues={{
					login: "",
					password: "",
				}}
			>
				<Form.Item
					rules={[
						{
							required: true,
							message: "Заполните поле",
						},
					]}
					label="LOGIN"
					name="login"
				>
					<Input size="large" />
				</Form.Item>{" "}
				<Form.Item
					rules={[
						{
							required: true,
							message: "Заполните поле",
						},
					]}
					label="PASSWORD"
					name="password"
				>
					<Input size="large" />
				</Form.Item>
				<Button isFullwidth type="primary" size="large">
					Create
				</Button>
			</Form>
		</div>
	);
};
