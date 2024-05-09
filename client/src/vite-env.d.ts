/// <reference types="vite/client" />

import { Dayjs } from "dayjs";
type DateType = string | number | Date | Dayjs;

declare module "dayjs" {
	interface Dayjs {
		$m: string;
		$d: Date;
		$H: string;
	}
}

declare module "*.scss";
