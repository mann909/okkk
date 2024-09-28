import axios from "axios";
import { useEffect, useState } from "react";

export const useAllUser = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	const [users, setUsers] = useState({});

	const [loading, setLoading] = useState(true);

	async function sendRequest() {
		setLoading(true);
		try {
			const res = await axios.get(`${BACKEND_URL}/api/v1/user/users`);
			if (res) {
				setUsers(res.data);
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
		users,
		loading,
	};
};
