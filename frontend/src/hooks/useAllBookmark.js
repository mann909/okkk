import axios from "axios";
import { useEffect, useState } from "react";

export const useAllBookmark = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	const [files, setFiles] = useState([]);

	const [loading, setLoading] = useState(true);

	async function sendRequest() {
		setLoading(true);
		try {
			const res = await axios.get(
				`${BACKEND_URL}/api/v1/user/getAllBookmarks`,
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			if (res.status === 200) {
				setFiles(res.data.files);
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
		files,
		loading,
	};
};
