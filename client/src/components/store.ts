import { IService } from "./types";
import { create } from "zustand";

interface IStore {
	open: boolean;

	setOpen: (param: boolean) => void;
}

export const useStore = create<IStore>()((set) => ({
	open: false,
	setOpen: (value) => set(() => ({ open: value })),
}));
