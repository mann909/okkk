import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import { FaComments, FaUser } from "react-icons/fa";

const Chatrooms = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const navigate = useNavigate();
	const [chatrooms, setChatrooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchChatrooms = async () => {
		try {
			const response = await axios.get(
				`${BACKEND_URL}/api/v1/chat/getChatrooms`,
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			console.log("Chatrooms response:", response.data);
			setChatrooms(response.data.chatrooms);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching chatrooms:", error);
			setError("Failed to load chatrooms");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchChatrooms();
	}, []);

	const handleChatroomClick = (chatroomName) => {
		navigate(`/chat/${chatroomName}`);
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
			<Sidebar />
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
					<div className="p-6 border-b border-gray-700">
						<h1 className="text-3xl font-bold mb-4 text-blue-400">
							Your Chatrooms
						</h1>
						{error && <div className="text-red-500 mb-4">{error}</div>}
					</div>
					<div className="p-6">
						{chatrooms.length === 0 ? (
							<div className="text-center py-8 text-gray-400">
								You don't have any active chatrooms yet.
							</div>
						) : (
							<ul className="space-y-4">
								{chatrooms.map((chatroom) => (
									<li
										key={chatroom.id}
										className="bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
									>
										<button
											onClick={() => handleChatroomClick(chatroom.name)}
											className="w-full text-left p-4 flex items-center space-x-4"
										>
											<FaComments className="text-2xl text-blue-400" />
											<div className="flex-grow">
												<h3 className="text-lg font-semibold">
													{chatroom.name}
												</h3>
												{/* <div className="flex items-center text-sm text-gray-400">
													<FaUser className="mr-2" />
													<span>
														{chatroom.participants
															.map((p) => p.name)
															.join(", ")}
													</span>
												</div> */}
											</div>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chatrooms;
