import axios from "axios";
import { useEffect, useState } from "react";

export const useCreateGroup = ({ chat_name }) => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	const [isCreated, setIsCreated] = useState(false);

	async function sendRequest() {
		try {
			const res = await axios.post(
				`${BACKEND_URL}/api/v1/chat/createChatGroup`,
				{
					name: chat_name,
				},
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			if (res.status === 200 || res.status === 400) {
				setIsCreated(true);
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
		isCreated,
	};
};
