import React, { useContext, useState, useEffect } from "react";
import { useAllUser } from "../hooks/useAllUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaUserCircle, FaEnvelope, FaComment } from "react-icons/fa";
import Loading from "../components/Loading";

const AllUsers = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const navigate = useNavigate();
	const { user } = useContext(AppContext);
	const { users, loading } = useAllUser();
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => {
		if (users && user) {
			const filtered = Object.values(users).filter(
				(u) =>
					u.id !== user.id &&
					(u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						u.email.toLowerCase().includes(searchTerm.toLowerCase()))
			);
			setFilteredUsers(filtered);
		}
	}, [users, user, searchTerm]);

	const handleChatClick = async (userId) => {
		try {
			const sortedIds = [user.id, userId].sort().join("_");
			const response = await axios.post(
				`${BACKEND_URL}/api/v1/chat/createChatGroup`,
				{ name: sortedIds },
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);

			if (response.data.status === 200 || response.data.status === 400) {
				navigate(`/chat/${sortedIds}`);
			}
		} catch (error) {
			setError("Failed to create/join chat room");
			console.error("Error:", error);
		}
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
			<Sidebar />
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
					<div className="p-6 border-b border-gray-700">
						<h1 className="text-3xl font-bold mb-4 text-blue-400">All Users</h1>
						<div className="relative mb-6">
							<input
								type="text"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full bg-gray-700 text-white border border-gray-600 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
							/>
							<FaSearch className="absolute left-3 top-3 text-gray-400" />
						</div>
						{error && <div className="text-red-500 mb-4">{error}</div>}
					</div>
					<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredUsers.map((user) => (
							<div
								key={user.id}
								className="bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
							>
								<div className="p-4">
									<div className="flex items-center mb-3">
										<FaUserCircle className="text-4xl text-blue-400 mr-3" />
										<div>
											<h3 className="text-lg font-semibold">{user.name}</h3>
											<div className="flex items-center text-sm text-gray-400">
												<FaEnvelope className="mr-1" />
												<span>{user.email}</span>
											</div>
										</div>
									</div>
									<button
										onClick={() => handleChatClick(user.id)}
										className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
									>
										<FaComment />
										<span>Chat</span>
									</button>
								</div>
							</div>
						))}
					</div>
					{filteredUsers.length === 0 && (
						<div className="text-center py-8 text-gray-400">
							No users found matching your search.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AllUsers;
