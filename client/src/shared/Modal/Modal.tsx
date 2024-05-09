import { Modal as ModalAntd } from "antd";
import s from "./Modal.module.scss";
import { ReactNode } from "react";

type HeaderProps = {
	open: boolean;
	setOpen: (arg: boolean) => void;
	header: ReactNode | string;
	children: ReactNode;
};

export const Modal = ({ open, setOpen, header, children }: HeaderProps) => {
	return (
		<ModalAntd
        
			open={open}
			onOk={() => setOpen(false)}
			onCancel={() => setOpen(false)}
			footer={false}
		>
			<div className={s.header}>{header}</div>
			<div className={s.content}>{children}</div>
		</ModalAntd>
	);
};
