import classNames from "classnames";

import s from "./Input.module.scss";

type InputProps = {
	size?: "small" | "medium" | "large";
	isFullwidth?: boolean;
};

//   Заменить на InputHTMLAttributes
export const Input = ({ size, isFullwidth, ...props }: InputProps & any) => {
	const inputClass = classNames(s.input, {
		[s.small]: size === "small",
		[s.medium]: size === "medium",
		[s.large]: size === "large",

		[s.isFullwidth]: isFullwidth,
	});

	return <input className={inputClass} {...props} />;
};
