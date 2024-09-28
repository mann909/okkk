import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useChatGroup } from "../hooks/useChatGroup";
import { AppContext } from "../context/AppContext";
// import Sidebar from "../components/Sidebar";
import { useCreateGroup } from "../hooks/useCreateGroup";
import Loading from "../components/Loading";

// Function to generate a color based on numeric user ID
const generateColor = (id) => {
	const numericId = parseInt(id, 10);
	const hue = numericId % 360;
	const saturation = 70 + (numericId % 30); // 70-100%
	const lightness = 45 + (numericId % 10); // 45-55%
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const ChatPage = () => {
	const { user } = useContext(AppContext);
	const { chat_name } = useParams();
	const navigate = useNavigate();
	const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const [currentChats, setCurrentChats] = useState([]);
	const [message, setMessage] = useState("");
	const [ws, setWs] = useState(null);
	const messagesEndRef = useRef(null);

	const { isCreated } = useCreateGroup({ chat_name });

	const { chats, loading } = useChatGroup({ chat_name });

	const scrollToBottom = () => {
		setTimeout(() => {
			window.scrollTo({
				top: document.documentElement.scrollHeight,
				behavior: "smooth",
			});
		}, 100);
	};

	useEffect(() => {
		if (isCreated && !loading && chats.messages) {
			setCurrentChats(chats.messages);
		}
	}, [chats, loading, isCreated]);

	useEffect(() => {
		scrollToBottom();
	}, [currentChats]);

	useEffect(() => {
		if (isCreated) {
			const websocket = new WebSocket(
				`ws://${WEBSOCKET_URL}/ws/chat/${chat_name}/`
			);

			websocket.onopen = () => {
				console.log("WebSocket connection established.");
			};

			websocket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				setCurrentChats((prevChats) => [
					...prevChats,
					{
						sender: {
							id: data.sender_id,
							name: data.sender_name,
						},
						message: data.message,
					},
				]);
			};

			websocket.onclose = () => {
				console.log("WebSocket connection closed.");
			};

			setWs(websocket);

			return () => {
				websocket.close();
			};
		}
	}, [chat_name, isCreated]);

	const sendMessage = async (e) => {
		e.preventDefault();

		if (!message.trim() || !isCreated) return;

		try {
			if (ws) {
				ws.send(
					JSON.stringify({
						message: message,
						sender_id: user.id,
						sender_name: user.name,
					})
				);
			}

			const res = await axios.post(
				`${BACKEND_URL}/api/v1/chat/${chat_name}/postMessage`,
				{
					message: message,
				},
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);

			setMessage("");
		} catch (error) {
			console.log(error);
		}
	};

	if (!isCreated) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-900 bg-yel">
			{/* <Sidebar /> */}
			<div className="flex-1 flex flex-col pl-[5rem] sm:pl-[5rem]">
				{/* Header Section */}
				<div className="sticky top-0 z-10 bg-gray-800 p-[0.5rem] sm:p-[1rem] shadow-md flex items-center justify-between">
					<h1 className="text-[1rem] sm:text-[1.5rem] font-bold text-white truncate">
						{chat_name}
					</h1>
					<button
						onClick={() => navigate(-1)}
						className="mr-2 p-2 bg-blue-500 text-white rounded-md text-sm hover:cursor-pointer"
					>
						Go Back
					</button>
				</div>

				{/* Chat Messages Section */}
				<div className="flex-1 p-[0.5rem] sm:p-[1rem] overflow-y-auto">
					{loading && !user ? (
						<Loading />
					) : (
						<div className="space-y-3 sm:space-y-4 flex flex-col">
							{currentChats.length > 0 ? (
								currentChats.map((chat, index) => (
									<div
										key={index}
										className={`flex flex-col gap-2 ${
											chat.sender.id === user.id ? "items-end" : "items-start"
										}`}
									>
										<span className="relative inline-block group">
											<span
												className="hover:text-white transition-colors duration-300 ease-in-out text-gray-400 text-xs hover:cursor-pointer"
												onClick={() => navigate(`/dashboard/${chat.sender.id}`)}
											>
												{chat.sender.name}
											</span>
											<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
										</span>
										<div
											className={`flex items-center gap-3 max-w-[75%] ${
												chat.sender.id === user.id ? "flex-row-reverse" : ""
											}`}
										>
											<div
												className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
												style={{
													backgroundColor: generateColor(chat.sender.id),
												}}
											>
												{chat.sender.name[0].toUpperCase()}
											</div>
											<div
												className={`p-2 sm:p-3 rounded-lg ${
													chat.sender.id === user.id
														? "bg-green-600 text-white"
														: "bg-gray-700 text-white"
												}`}
											>
												<p className="text-sm break-words">{chat.message}</p>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="text-center text-sm text-white">
									No messages yet.
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				{/* Message Input Section */}
				<div className="sticky bottom-0 bg-gray-800 p-[0.5rem] sm:p-[1rem] shadow-md">
					<form onSubmit={sendMessage} className="flex items-center space-x-2">
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="flex-1 p-2 rounded-md bg-gray-700 text-white text-sm"
							placeholder="Type your message..."
						/>
						<button
							type="submit"
							className="p-2 bg-green-500 text-white rounded-md text-sm"
						>
							Send
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
