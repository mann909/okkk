import React from "react";
import male from "../assets/male.png";
import female from "../assets/female.png";

const LeaderboardItem = ({ rank, gender, name, ratings }) => {
	return (
		<div className="flex items-center justify-between p-3 sm:p-4 md:p-5">
			<div className="flex items-center flex-grow">
				<span className="text-lg sm:text-xl md:text-2xl font-bold mr-3 sm:mr-4 md:mr-6 text-gray-400 w-8 sm:w-10 flex-shrink-0">
					{rank}
				</span>
				<img
					src={gender == "male" ? female : male}
					alt={name}
					className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full mr-3 sm:mr-4 md:mr-6 border-2 border-gray-600 flex-shrink-0"
				/>
				<div className="min-w-0 flex-grow">
					<h3 className="font-semibold text-base sm:text-lg md:text-xl truncate">
						{name}
					</h3>
					<div className="text-sm sm:text-base text-gray-400">
						{ratings} ratings
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardItem;
