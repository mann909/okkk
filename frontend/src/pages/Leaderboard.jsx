import React from "react";
import { useNavigate } from "react-router-dom";
import Podium from "../components/Podium";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import { useAllUser } from "../hooks/useAllUser";
import LeaderboardItem from "../components/LeaderboardItem";

const Leaderboard = () => {
	const navigate = useNavigate();
	const { users, loading } = useAllUser();

	if (loading) {
		return <Loading />;
	}

	const sortedData = [...users].sort((a, b) => b.ratings - a.ratings);

	const topThree = sortedData.slice(0, 3);
	const remainingUsers = sortedData.slice(3);

	const handleItemClick = () => {
		navigate("/");
	};

	return (
		<div className="bg-gradient-to-b from-gray-900 to-gray-800">
			<Sidebar />
			<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white ml-20 py-8 px-2 sm:px-4 md:px-6 lg:px-8">
				<div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
						Leaderboard
					</h1>
					<div className="bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
						<div className="p-4 sm:p-6 md:p-8">
							<div className="overflow-x-auto">
								<Podium topThree={topThree} />
							</div>
							<div className="mt-6 h-64 md:h-48 lg:h-56 overflow-y-auto no-scrollbar">
								{remainingUsers.map((user, index) => (
									<div
										key={user.name}
										className="transition-all duration-300 hover:bg-gray-700 rounded-xl mb-2 cursor-pointer"
										onClick={handleItemClick}
									>
										<LeaderboardItem rank={index + 4} {...user} />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
