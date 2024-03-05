export const getDateMonthAgo = (date) => {
	const currentMonth = date.split(" ")[0].split("-")[1];
	const newMonth = String(Number(currentMonth) - 1);

	return `${date.slice(0, 4)}-${
		currentMonth === "01"
			? "12"
			: newMonth.length === 1
			? `0${newMonth}`
			: newMonth
	}${date.slice(7)}`;
};
