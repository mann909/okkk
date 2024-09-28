import React from "react";
import male from "../assets/male.png";
import female from "../assets/female.png";

const Podium = ({ topThree }) => {
	const getBorderColor = (index) => {
		switch (index) {
			case 0:
				return "border-yellow-400";
			case 1:
				return "border-gray-300";
			case 2:
				return "border-yellow-700";
			default:
				return "border-gray-600";
		}
	};

	console.log(topThree[0]);

	const getOrder = (index) => {
		switch (index) {
			case 0:
				return "order-2";
			case 1:
				return "order-1";
			case 2:
				return "order-3";
			default:
				return "";
		}
	};
	return (
		<div className="flex justify-center items-end mb-8">
			{topThree.map((user, index) => (
				<div
					key={user.name}
					className={`flex flex-col mt-4 items-center mx-1 sm:mx-2 md:mx-4 lg:mx-6 ${getOrder(
						index
					)}`}
				>
					<div className="relative mb-2">
						<img
							src={user.gender === "male" ? male : female}
							alt={user.name}
							className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 ${getBorderColor(
								index
							)} shadow-lg`}
						/>
						<div
							className={`absolute -top-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 border-2 ${getBorderColor(
								index
							)} flex items-center justify-center`}
						>
							<span className="text-lg sm:text-xl font-bold text-white">
								#{index + 1}
							</span>
						</div>
					</div>
					<h3 className="font-bold text-sm sm:text-base truncate max-w-[80px] sm:max-w-[100px] md:max-w-[120px] text-center">
						{user.name}
					</h3>
					<div className="text-xs sm:text-sm text-gray-300 mb-2">
						<p>{user.ratings} ratings</p>
					</div>
					<div
						className={`w-16 sm:w-20 md:w-24 lg:w-28 ${
							index === 1
								? "h-16 sm:h-20"
								: index === 0
								? "h-20 sm:h-24"
								: "h-12 sm:h-16"
						} ${
							index === 1
								? "bg-gray-300"
								: index === 0
								? "bg-yellow-400"
								: "bg-yellow-700"
						} rounded-t-lg shadow-md`}
					/>
				</div>
			))}
		</div>
	);
};

export default Podium;
