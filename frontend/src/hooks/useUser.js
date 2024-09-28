import axios from "axios";
import { useEffect, useState } from "react";

export const useUser = ({ user_id }) => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	const [user, setUser] = useState({});

	const [loading, setLoading] = useState(true);

	async function sendRequest() {
		setLoading(true);
		try {
			const res = await axios.get(
				`${BACKEND_URL}/api/v1/user/getUserById/${user_id}`,
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			if (res.status === 200) {
				console.log(res.data);
				setUser(res.data.user);
				setLoading(false);
			} else {
				alert("Error while fetching student");
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		sendRequest();
	}, []);

	return {
		user,
		loading,
	};
};
