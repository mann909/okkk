import axios from "axios";
import { useEffect, useState } from "react";

export const useFiles = ({ user_id }) => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	const [files, setFiles] = useState([]);

	const [loading1, setLoading1] = useState(true);

	async function sendRequest() {
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/user/files`, {
				user_id: user_id,
			});
			if (res) {
				setFiles(res.data.files);
				setLoading1(false);
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
		files,
		loading1,
	};
};
