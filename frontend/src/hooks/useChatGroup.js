import axios from "axios";
import { useEffect, useState } from "react";

export const useChatGroup = ({ chat_name }) => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	const [chats, setChats] = useState({});

	const [loading, setLoading] = useState(true);
	async function sendRequest() {
		setLoading(true);
		try {
			const res = await axios.get(
				`${BACKEND_URL}/api/v1/chat/getChats/${chat_name}`,
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			if (res.status == 200) {
				console.log("in get chats hook");
				console.log(res.data.chats);
				setChats(res.data.chats);
				setLoading(false);
			} else {
				alert("Error while fetching doubt");
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		sendRequest();
	}, []);

	return {
		chats,
		loading,
	};
};
