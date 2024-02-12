import { create } from "zustand";

type PageProps = {
	filters: { [label: string]: string[] };
	setFilters: (value) => void;
};

export const useFilterStore = create<PageProps>((set) => ({
	filters: {},
	setFilters: (value) => set(() => ({ filters: value })),
}));
