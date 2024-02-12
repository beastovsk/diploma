import { Button, Input } from "../../shared";
import classNames from "classnames";

import s from "./Register.module.scss";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import type { EventProps } from "../../types";

export const Register = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [requestData, setRequestData] = useState({
		login: "",
		password: "",
		confirmPassword: "",
	});

	const isDisabled = useMemo(() => {
		const { login, password, confirmPassword } = requestData;

		return !login || !password || !confirmPassword;
	}, [requestData]);

	const loginStyle = classNames(s.pagination, {
		[s.login]: pathname === "/log-in",
	});
	const signupStyle = classNames(s.pagination, {
		[s.signup]: pathname === "/sign-up",
	});

	const handleSubmit = () => {
		if (isDisabled) return;
	};

	useEffect(() => {
		setRequestData({ login: "", password: "", confirmPassword: "" });
	}, [pathname]);

	return (
		<div className={s.container}>
			<div className={s.wrapper}>
				<div className={s.header}>
					<a
						className={loginStyle}
						onClick={() => navigate("/log-in")}
					>
						Log in
					</a>
					<a
						className={signupStyle}
						onClick={() => navigate("/sign-up")}
					>
						Sign up
					</a>
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
						<Input
							value={requestData.confirmPassword}
							onChange={(e: EventProps) =>
								setRequestData((prev) => ({
									...prev,
									confirmPassword: e.target.value,
								}))
							}
							size="large"
							placeholder="Confirm password"
						/>
					</div>

					<Button
						size="large"
						disabled={isDisabled}
						onClick={handleSubmit}
					>
						Continue
					</Button>
				</div>
			</div>
		</div>
	);
};
