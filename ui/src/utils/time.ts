export const convertMinutesToTimeString = (minutes: number) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const remainingMinutes = minutes % 60;
    if (days > 0) {
        return `${days}d ${hours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    } else {
        return `${remainingMinutes}m`;
    }
};
