import { create } from "zustand";

type PageProps = {
	isSidebarOpen: boolean;
	setSidebarOpen: () => void;
};

export const usePageStore = create<PageProps>((set) => ({
	isSidebarOpen: true,
	setSidebarOpen: () =>
		set((state: PageProps) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
