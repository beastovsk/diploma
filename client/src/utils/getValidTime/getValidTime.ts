export const getValidTime = (hours: string, minutes: string) => {
	const newHours = String(hours).length === 1 ? `0${hours}` : String(hours);
	const newMinutes =
		String(minutes).length === 1 ? `0${minutes}` : String(minutes);

	return `${newHours}:${newMinutes}`;
};
