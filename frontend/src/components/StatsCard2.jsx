import React from "react";
import { useState, useEffect } from "react";

const StatsCard2 = ({ views }) => {
	//   const [up, setUp] = useState(true);

	//   function compareCurrentAndPreviousMonth(dates) {
	//     const now = new Date();
	//     const currentMonth = now.getMonth();
	//     const currentYear = now.getFullYear();

	//     const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
	//     const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

	//     let currentMonthCount = 0;
	//     let previousMonthCount = 0;

	//     dates.forEach(({ date, count }) => {
	//       const dateObj = new Date(date);
	//       const month = dateObj.getMonth();
	//       const year = dateObj.getFullYear();

	//       if (year === currentYear && month === currentMonth) {
	//         currentMonthCount += count;
	//       } else if (year === previousYear && month === previousMonth) {
	//         previousMonthCount += count;
	//       }
	//     });

	//     return currentMonthCount > previousMonthCount;
	//   }

	//   useEffect(() => {
	//     const dates = sol.map((solution) => {
	//       return {
	//         date: solution.postedOn.split("T")[0],
	//         upvotes: solution.upvotes,
	//       };
	//     });
	//     const data1 = {};

	//     for (let i = 0; i < dates.length; i++) {
	//       let ele = dates[i].date;
	//       let upvotes = dates[i].upvotes;
	//       if (data1[ele]) {
	//         data1[ele] += upvotes;
	//       } else {
	//         data1[ele] = upvotes;
	//       }
	//     }

	//     const values = Object.entries(data1).map((entry) => {
	//       return {
	//         date: entry[0],
	//         count: entry[1],
	//       };
	//     });
	//     console.log(values);
	//     setUp(compareCurrentAndPreviousMonth(values));
	//   }, []);
	return (
		<div className="bg-gray-900 rounded-lg p-4 shadow-md max-w-xs mx-auto">
			<div className="flex justify-between items-center mb-2 space-x-2">
				<h2 className="text-white text-lg font-semibold">Total Views</h2>
				{/* {up ? (
          <i className="bx bx-trending-up text-green-500 text-xl"></i>
        ) : (
          <i className="bx bx-trending-down text-red-500 text-xl"></i>
        )} */}
			</div>
			<div className="text-[#00FFFF] text-3xl font-bold">{views}</div>
			<p className="text-gray-400 text-xs mt-1">Compared to last month</p>
		</div>
	);
};

export default StatsCard2;
