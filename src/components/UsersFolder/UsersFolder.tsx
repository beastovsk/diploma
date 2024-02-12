import openDir from "../../assets/open-dir.svg";
import closeDir from "../../assets/close-dir.svg";
import agentIcon from "../../assets/agent-icon.svg";
import settingsIcon from "../../assets/agent-settings.svg";
import addIcon from "../../assets/agent-add.svg";
import loader from "../../assets/loader.svg";

import s from "./UsersFolder.module.scss";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SetStateAction, useEffect, useState } from "react";
import { Modal } from "../../shared";
import { Form, Input } from "antd";
import { Button } from "../../shared";
import { useMutation } from "react-query";
import {
	AgentsRequest,
	AgentCreate,
	useProfileStore,
	useFilterStore,
} from "../../data";
import { getFormattedUsersTree } from "../../utils";
import { CreateHall } from "..";

export const UsersFolder = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { setFilters } = useFilterStore();
	const [form] = Form.useForm();
	const [activeIds, setActiveIds] = useState<number[]>([]);
	const [agentId, setAgentId] = useState<number>();
	const [open, setOpen] = useState(false);
	const [openHall, setOpenHall] = useState(false);
	const [usersTree, setUsersTree] = useState([]);
	const { userInfo } = useProfileStore();

	const { mutate } = useMutation(AgentsRequest);
	const { mutate: addAgent } = useMutation(AgentCreate);

	useEffect(() => {
		const id = pathname.split("/").at(-1);

		handleRefetchAgents();

		if (Number.isNaN(id) || activeIds.length > 0) return;
		setActiveIds([Number(id)]);
	}, []);

	const handleRefetchAgents = () => {
		mutate(
			{
				parent: userInfo?.id,
			},
			{
				onSuccess: ({data}) => {
					if (data.error) return

					if (data.content?.list.length === 1) {
						return setUsersTree(data.content?.list);
					}
					const { agents: agentsTree } = getFormattedUsersTree({
						data: data.content?.list,
						parentId: 0,
					});
					setUsersTree(agentsTree as SetStateAction<never[]>);
					setFilters(data.content.filters)
				},
			}
		);
	};

	const onToggleId = (id: number) => {
		if (activeIds.includes(id)) {
			const index = activeIds.findIndex((item) => item === id);
			return setActiveIds(() => [
				...activeIds.slice(0, index),
				...activeIds.slice(index + 1),
			]);
		}

		setActiveIds((prev) => [...prev, id]);
	};

	const handleSubmitCreateUser = async (data: {
		login: string;
		password: string;
	}) => {
		form.resetFields();

		addAgent(
			{ parent: agentId as number, ...data },
			{
				onSuccess: (res) => {
					if (res.data.errors) return;
					const id = res.data.content.id;
					navigate(`/dashboard/agent/${id}/settings`);
					handleRefetchAgents();
				},
			}
		);

		setOpen(false);
	};

	const modal = (
		<Modal
			header="AGENT CREATE"
			open={open}
			setOpen={() => {
				form.resetFields();
				setOpen(false);
			}}
		>
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
		</Modal>
	);
	const createHallModal = (
		<Modal
			header="HALL CREATE"
			open={openHall}
			setOpen={() => {
				setOpenHall(false);
			}}
		>
			<CreateHall
				parent={agentId}
				closeModal={() => setOpenHall(false)}
			/>
		</Modal>
	);

	const getAgentActions = ({ agents, id }: { agents: []; id: number }) => {
		return agents?.length ? (
			<div className={s.actions}>
				{userInfo.id != id ? (
					<NavLink to={`agent/${id}/settings`}>
						<img src={settingsIcon} width={15} height={15} />
					</NavLink>
				) : null}

				<div
					onClick={() => {
						setOpen(true);
						setAgentId(id);
					}}
				>
					<img src={addIcon} width={15} height={15} />
				</div>
				<div
					onClick={(e) => {
						e.preventDefault();
						setOpenHall(true);
						setAgentId(id);
					}}
					className={s.addHall}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 10 10"
						fill="green"
					>
						<path
							d="M5 8V2M2 5H8"
							stroke="green"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				{modal}
				{agentId == id ? createHallModal : null}
			</div>
		) : (
			<div className={s.userSettings}>
				{userInfo.id != id ? (
					<NavLink to={`agent/${id}/settings`}>
						<img src={settingsIcon} width={15} height={15} />
					</NavLink>
				) : null}
				<div
					onClick={() => {
						setOpen(true);
						setAgentId(id);
					}}
				>
					<img src={addIcon} width={15} height={15} />
				</div>
				{modal}
				{agentId == id ? createHallModal : null}
				<div
					onClick={(e) => {
						e.preventDefault();
						setOpenHall(true);
						setAgentId(id);
					}}
					className={s.addHall}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 10 10"
						fill="green"
					>
						<path
							d="M5 8V2M2 5H8"
							stroke="green"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>
		);
	};

	const agentHeader = ({
		agentInfo,
	}: {
		agentInfo: {
			id: number;
			login: string;
			agents: [];
		};
	}) => {
		const { id, login, agents } = agentInfo;

		return (
			<div className={s.header}>
				{agents?.length ? (
					<div className={s.dirImage} onClick={() => onToggleId(id)}>
						<img
							src={activeIds.includes(id) ? closeDir : openDir}
						/>
					</div>
				) : (
					<img src={agentIcon} width={15} height={15} />
				)}
				<NavLink
					className={`${s.login} ${
						pathname.split("/").at(-1) === String(id)
							? s.active
							: ""
					} :`}
					onClick={() => setActiveIds((prev) => [...prev, id])}
					to={`/dashboard/statistic/${id}`}
				>
					{login}
				</NavLink>
				{getAgentActions({ agents, id })}
			</div>
		);
	};

	const agentContent = ({
		agentInfo,
	}: {
		agentInfo: {
			id: number;
			login: string;
			agents: [];
		};
	}) => {
		const { agents, id } = agentInfo;

		if (!activeIds.includes(id)) {
			return <></>;
		}

		return (
			<div className={s.content}>
				{agents?.length
					? agents?.map(
							({
								id,
								login,
								agents,
							}: {
								id: number;
								login: string;
								agents: [];
							}) => (
								<div key={id}>
									{agentHeader({
										agentInfo: { id, login, agents },
									})}
									{agentContent({
										agentInfo: { id, login, agents },
									})}
								</div>
							)
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  )
					: null}
			</div>
		);
	};

	return (
		<div className={s.container}>
			{usersTree?.length ? (
				usersTree?.map(({ id, login, agents }) => (
					<div key={id}>
						{agentHeader({ agentInfo: { id, login, agents } })}
						{agentContent({ agentInfo: { id, login, agents } })}
					</div>
				))
			) : (
				<div className={s.loader}>
					{" "}
					<img src={loader} width={30} height={30} />
				</div>
			)}
		</div>
	);
};
