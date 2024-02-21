import { create } from "zustand";

type UserProps = {
	login: string;
	id: number;
};

type PageProps = {
	token: string | null;
	userInfo: UserProps;
	updateUserInfo: (res: UserProps) => void;
	updateToken: (res: string) => void;
};

export const useProfileStore = create<PageProps>((set) => ({
	token: localStorage.getItem("token"),
	userInfo: { login: "", id: null },
	updateToken: (res: string) => set(() => ({ token: res })),
	updateUserInfo: (res: UserProps) => set(() => ({ userInfo: res })),
}));
