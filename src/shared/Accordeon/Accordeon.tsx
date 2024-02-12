import { ReactElement, ReactNode, useEffect, useState } from "react";
import accordeonArrow from "../../assets/accordeon-arrow.svg";

import cx from "classnames";

import s from "./Accordeon.module.scss";
import { CSSTransition } from "react-transition-group";
import { usePageStore } from "../../data";
import { useLocation } from "react-router";

type AccordeonProps = {
	label: ReactElement | string;
	children: ReactNode;
};

export const Accordeon = ({ label, children }: AccordeonProps) => {
	const { pathname } = useLocation();
	const [isOpen, setOpen] = useState(false);
	const { isSidebarOpen } = usePageStore();

	useEffect(() => {
		const id = pathname.split("/");

		if (id.at(-1) === "") return;

		// если хоть один Id есть в url - раскрывать список
		if (
			id
				.map((item) => Number.isNaN(Number(item)))
				.slice(1)
				.includes(false)
		) {
			setOpen(true);
		}
	}, [pathname]);

	return (
		<div className={s.accordeon}>
			<div className={s.header} onClick={() => setOpen((prev) => !prev)}>
				{label}
				<CSSTransition
					in={isSidebarOpen}
					timeout={300}
					classNames={"fade"}
					unmountOnExit
				>
					<img
						src={accordeonArrow}
						className={cx({ [s.open]: isOpen })}
						width={10}
						height={10}
					/>
				</CSSTransition>
			</div>
			{isOpen && isSidebarOpen ? (
				<div className={s.content}>{children}</div>
			) : null}
		</div>
	);
};
