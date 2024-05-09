import { ReactElement } from "react";
import classNames from "classnames";
import loader from "../../assets/loader.svg";
import s from "./Button.module.scss";

type ButtonProps = {
	type?: "default" | "primary" | "danger" | "outlined";
	size?: "small" | "medium" | "large";
	disabled?: boolean;
	isFullwidth?: boolean;
	isLoading?: boolean;
	children: ReactElement | string;
};

export const Button = ({
	type,
	size,
	disabled,
	isFullwidth,
	isLoading = false,
	children,
	...args
}: // Заменить на ButtonHTMLAttributes
ButtonProps & any) => {
	const btnClass = classNames(s.button, {
		[s.default]: type === "default",
		[s.primary]: type === "primary",
		[s.danger]: type === "danger",
		[s.outlined]: type === "outlined",

		[s.small]: size === "small",
		[s.medium]: size === "medium",
		[s.large]: size === "large",

		[s.disabled]: disabled || isLoading,
		[s.isFullwidth]: isFullwidth,
	});

	return (
		<button
			type="submit"
			disabled={disabled || isLoading}
			className={btnClass}
			{...args}
		>
			{isLoading ? (
				<img src={loader} alt="" width={15} height={15} />
			) : (
				children
			)}
		</button>
	);
};
