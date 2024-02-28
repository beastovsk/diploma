import { Select, Skeleton } from "antd";
import { CSSTransition } from "react-transition-group";
import s from "./Sidebar.module.scss";

import home from "../../assets/home.svg";
import balance from "../../assets/balance.svg";
import create_agent from "../../assets/create-agent.svg";
import users from "../../assets/users.svg";
import rtp from "../../assets/rtp.svg";
import settings from "../../assets/settings.svg";
import logout from "../../assets/logout.svg";

import arrow from "../../assets/arrow.svg";
import burger from "../../assets/burger.svg";

import searchIcon from "../../assets/search.svg";

import cx from "classnames";
import { useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { Accordeon } from "../../shared";
import { AccountInfoRequest, usePageStore, useProfileStore } from "../../data";
import { UsersFolder } from "../UsersFolder";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const menuItems = [
	{ title: "Home", icon: home, link: "statistic" },
	{ title: "My Balance", icon: balance, link: "my-balance" },
	{ title: "Create agent", icon: create_agent, link: "create-agent" },
	{ title: "Users", icon: users, link: "users", isAccordeon: true },
	{ title: "RTP", icon: rtp, link: "rtp" },
	{ title: "Settings", icon: settings, link: "settings" },
	{ title: "Log out", icon: logout, link: "log-out" },
];

export const Sidebar = () => {
	const { userInfo, updateUserInfo } = useProfileStore();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isSidebarOpen, setSidebarOpen } = usePageStore();
	const {
		data: userInfoAsync,
		isLoading,
		isSuccess,
	} = useQuery("info", () => AccountInfoRequest());
	const [search, setSearch] = useState({
		type: "login",
		value: "",
	});

	const handleSearch = () => {
		navigate({
			pathname: "/dashboard/search",
			search: `type=${search.type}&value=${search.value}`,
		});
	};

	useEffect(() => {
		if (!isSuccess) return;

		const {
			data: { error, content },
		} = userInfoAsync;

		if (error === "account_not_found") {
			localStorage.clear();
			return navigate("/log-in");
		}
		if (content) {
			const { id, login } = content;
			updateUserInfo({ id, login });
		}
	}, [isSuccess]);

	return (
		<div className={cx(s.sidebar, { [s.closed]: !isSidebarOpen })}>
			<div className={s.header}>
				<button
					className={s.button}
					onClick={() => {
						setSidebarOpen();
					}}
				>
					{isSidebarOpen ? (
						<img
							src={arrow}
							className={`${s.buttonIcon} ${s.arrow}`}
							width={15}
							height={15}
						/>
					) : (
						<img
							className={s.buttonIcon}
							src={burger}
							width={15}
							height={15}
						/>
					)}
				</button>
				<CSSTransition
					in={isSidebarOpen}
					timeout={300}
					classNames={"fade"}
					unmountOnExit
				>
					<span>
						{userInfo.login ? (
							"@" + userInfo.login
						) : (
							<Skeleton.Input active={isLoading} size={"small"} />
						)}
					</span>
				</CSSTransition>
			</div>
			<div className={s.search}>
				<div onClick={handleSearch}>
					<img
						className={s.buttonIcon}
						src={searchIcon}
						width={15}
						height={15}
					/>
				</div>
				<CSSTransition
					in={isSidebarOpen}
					timeout={300}
					classNames={"fade"}
					unmountOnExit
				>
					<input
						className={s.input}
						onChange={(e) =>
							setSearch((prev) => ({
								...prev,
								value: e.target.value,
							}))
						}
					/>
				</CSSTransition>
				<CSSTransition
					in={isSidebarOpen}
					timeout={300}
					classNames={"fade"}
					unmountOnExit
				>
					<Select
						defaultValue="login"
						className={s.select}
						onChange={(value) =>
							setSearch((prev) => ({
								...prev,
								type: value,
							}))
						}
						options={[
							{ value: "login", label: "LOGIN" },
							{ value: "player", label: "PLAYERS" },
							{ value: "actionId", label: "ACTION ID" },
						]}
					/>
				</CSSTransition>
			</div>
			<ul className={s.list}>
				{menuItems.map(({ icon, link, title, isAccordeon }) => {
					const label = (
						<>
							<img
								src={icon}
								className={s.icon}
								width={20}
								height={20}
							/>
							<CSSTransition
								in={isSidebarOpen}
								timeout={300}
								classNames={"fade"}
								unmountOnExit
							>
								<span>{title}</span>
							</CSSTransition>
						</>
					);
					if (isAccordeon && link === "users") {
						return (
							<div className={s.accordeon} key={link}>
								<Accordeon
									key={title}
									label={
										<div className={s.accordeonLabel}>
											{label}
										</div>
									}
								>
									<UsersFolder />
								</Accordeon>
							</div>
						);
					}

					if (link === "log-out") {
						return (
							<NavLink
								key={title}
								to={`/log-in`}
								className={s.link}
								onClick={() => localStorage.removeItem("token")}
							>
								<div className={s.item}>{label}</div>
							</NavLink>
						);
					}

					return (
						<NavLink
							key={title}
							to={`/dashboard/${link}`}
							className={cx(s.link, {
								[s.active]: pathname.split("/").includes(link),
							})}
						>
							<div className={s.item}>{label}</div>
						</NavLink>
					);
				})}
			</ul>
		</div>
	);
};
