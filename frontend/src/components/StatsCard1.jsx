import React, { useState, useEffect } from "react";

const StatsCard1 = ({ ratings }) => {
	return (
		<div className="bg-gray-900 rounded-lg p-4 shadow-md max-w-xs mx-auto">
			<div className="flex justify-between items-center mb-2 space-x-2">
				<h2 className="text-white text-lg font-semibold">Total Ratings</h2>
			</div>
			<div className="text-[#FFA500] text-3xl font-bold">{ratings}</div>
			<p className="text-gray-400 text-xs mt-1">Real Time Updated Data</p>
		</div>
	);
};

export default StatsCard1;
