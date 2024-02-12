import { Button, Input } from "../../shared";
import classNames from "classnames";

import s from "./Authorization.module.scss";
import { useLocation, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import type { EventProps } from "../../types";
import { useMutation } from "react-query";
import { LoginRequest, useProfileStore } from "../../data";
import { notification } from "antd";

export type LoginRequest = { login: string; password: string };

export const Authorization = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [requestData, setRequestData] = useState({ login: "", password: "" });
	const { updateToken } = useProfileStore();
	const [api, contextHolder] = notification.useNotification();
	// const doesAnyHistoryEntryExist = key !== "default";

	const { mutate, isLoading } = useMutation((data: LoginRequest) => {
		return LoginRequest(data);
	});

	const isDisabled = useMemo(() => {
		const { login, password } = requestData;

		return !login || !password;
	}, [requestData]);

	const loginStyle = classNames(s.pagination, {
		[s.login]: pathname === "/log-in",
	});
	// const signupStyle = classNames(s.pagination, {
	// 	[s.signup]: pathname === "/sign-up",
	// });

	const openNotification = (content: { error?: string }) => {
		const { error } = content;

		api.info({
			message: error ? "Error" : "Success",
			description: error ? error : "Successfully logged in",
			placement: "topRight",
		});
	};
	const handleSubmit = () => {
		if (isDisabled) return;
		mutate(requestData, {
			onSuccess: ({ data }) => {
				openNotification(data.content);
				// if (data.error) return;

				// if (doesAnyHistoryEntryExist) {
				// 	navigate(-1);
				// }
				navigate("/dashboard");
				localStorage.setItem("token", data?.content?.token);
				updateToken(data?.content?.token);
				setRequestData({ login: "", password: "" });
			},
		});
	};

	return (
		<div className={s.container}>
			{contextHolder}

			<div className={s.wrapper}>
				<div className={s.header}>
					<a
						className={loginStyle}
						onClick={() => navigate("/log-in")}
					>
						Log in
					</a>
					{/* <a
						className={signupStyle}
						onClick={() => navigate("/sign-up")}
					>
						Sign up
					</a> */}
				</div>
				<div className={s.content}>
					<div className={s.inputs}>
						<Input
							value={requestData.login}
							onChange={(e: EventProps) =>
								setRequestData((prev) => ({
									...prev,
									login: e.target.value,
								}))
							}
							size="large"
							placeholder="Login"
						/>
						<Input
							value={requestData.password}
							onChange={(e: EventProps) =>
								setRequestData((prev) => ({
									...prev,
									password: e.target.value,
								}))
							}
							size="large"
							placeholder="Password"
						/>
					</div>

					<Button
						size="large"
						disabled={isDisabled}
						onClick={handleSubmit}
						isLoading={isLoading}
					>
						Continue
					</Button>
				</div>
			</div>
		</div>
	);
};
