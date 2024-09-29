import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const HeatMap = ({ uploads }) => {
	//   console.log("uploads : " + uploads);
	const [data, setData] = useState([]);
	const [days, setDays] = useState(0);
	const [streak, setStreak] = useState(0);
	const [sub, setSub] = useState(0);
	const startDate = new Date("2024-01-01");
	const endDate = new Date("2024-12-31");

	function findMaxStreak(dates) {
		if (!dates.length) return 0;

		// Sort the dates array by the date
		dates.sort((a, b) => new Date(a.date) - new Date(b.date));

		let maxStreak = 0;
		let currentStreak = 0;
		let lastDate = null;

		dates.forEach(({ date, count }) => {
			if (count > 0) {
				const currentDate = new Date(date);

				if (lastDate) {
					const dayDifference =
						(currentDate - lastDate) / (1000 * 60 * 60 * 24);

					if (dayDifference === 1) {
						currentStreak++;
					} else {
						maxStreak = Math.max(maxStreak, currentStreak);
						currentStreak = 1;
					}
				} else {
					currentStreak = 1;
				}

				lastDate = currentDate;
			}
		});

		maxStreak = Math.max(maxStreak, currentStreak);

		return maxStreak;
	}

	useEffect(() => {
		const dates = uploads.map((file) => {
			return file.uploadedAt.split("T")[0];
		});

		console.log(dates);
		const data1 = {};

		for (let i = 0; i < dates.length; i++) {
			let ele = dates[i];
			if (data1[ele]) {
				data1[ele] += 1;
			} else {
				data1[ele] = 1;
			}
		}

		let count = 0;
		for (let key in data1) {
			count += data1[key];
		}
		const values = Object.entries(data1).map((entry) => {
			return {
				date: entry[0],
				count: entry[1],
			};
		});
		setData(values);
		setSub(count);
		setStreak(findMaxStreak(values));
		setDays(values.length);
	}, []);

	return (
		<>
			{data ? (
				<div className="mt-4 p-4 bg-gray-900 rounded-lg w-full">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
						<div className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-0">
							<span className="text-green-500 text-base sm:text-lg md:text-xl mr-1">
								{sub}
							</span>{" "}
							submissions in the past one year{" "}
							<span className="text-gray-500">ⓘ</span>
						</div>
						<div className="flex flex-col sm:flex-row items-start sm:items-center text-sm sm:text-base md:text-lg">
							<div className="text-gray-400 mr-2 sm:mr-4">
								Total active days: <span className="text-white">{days}</span>
							</div>
							<div className="text-gray-400">
								Max streak: <span className="text-white">{streak}</span>
							</div>
						</div>
					</div>
					<div className="w-full overflow-x-scroll no-scrollbar">
						<div className="h-40 sm:h-48 md:h-44 w-[1000px] mx-auto">
							<CalendarHeatmap
								startDate={startDate}
								endDate={endDate}
								values={data}
								classForValue={(value) => {
									if (!value) {
										return "color-gitlab-1";
									}
									return `color-github-${value.count}`;
								}}
								tooltipDataAttrs={(value) => {
									if (!value || !value.date) {
										return;
									}
									return {
										"data-tip": `${value.date} has submission: ${value.count}`,
									};
								}}
								showWeekdayLabels={false}
								onClick={(value) =>
									alert(`${value.date} has submission: ${value.count}`)
								}
							/>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default HeatMap;
