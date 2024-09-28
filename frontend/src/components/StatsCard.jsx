import React from "react";

const StatsCard = ({ uploads }) => {
	return (
		<div className="bg-gray-900 rounded-lg p-4 shadow-md max-w-xs mx-auto">
			<div className="flex justify-between items-center mb-2 space-x-2">
				<h2 className="text-white text-lg font-semibold">
					Total Files Uploaded
				</h2>
			</div>
			<div className="text-[#FF5C8A] text-3xl font-bold">{uploads}</div>
			<p className="text-gray-400 text-xs mt-1">Compared to last month</p>
		</div>
	);
};

export default StatsCard;
