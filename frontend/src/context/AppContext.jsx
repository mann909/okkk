import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState({
		id: "",
		name: "",
		email: "",
		ratingList: [],
		bookmarkList: [],
		chatList: [],
	});
	const [loggedIn, setLoggedIn] = useState(false);
	const [recommendedFiles, setRecommendedFiles] = useState(null);
	const [allFiles, setAllFiles] = useState([]);
	const [topRated, setTopRated] = useState(null);
	const [popular, setPopular] = useState(null);
	const [gotFiles, setGotFiles] = useState(false);
	const [temp, setTemp] = useState([]);

	const getToprated = (t) => {
		return t.sort((a, b) => b.rating - a.rating);
	};
	const getPopular = (t) => {
		return t.sort((a, b) => b.views - a.views);
	};

	useEffect(() => {
		console.log("after updation : ");
		setAllFiles(temp);
		console.log(allFiles);
	}, [gotFiles]);

	async function sendRequest() {
		try {
			const res = await axios.get(`${BACKEND_URL}/api/v1/user/getUser`, {
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			if (res.data.status === 200) {
				setLoggedIn(true);
				const temp = res.data.user;
				console.log("Fetched user:", temp); // Logging fetched data
				setUser(temp); // Update the state
				user.id = temp.id;
				user.name = temp.name;
				user.email = temp.email;
				user.ratingList = temp.ratingList;
				user.bookmarkList = temp.bookmarkList;
				user.chatList = temp.chatList;
				setUser(user);
				console.log("user after updation", user);

				console.log("all files are : ", res.data.allFiles);
				const tempAll = res.data.allFiles;
				if (res.data.allFiles) {
					setGotFiles(true);
					setTemp(res.data.allFiles);
				}
				const tempTop = getToprated([...tempAll]);
				const popular = getPopular([...tempAll]);
				// console.log(tempAll)
				setAllFiles(tempAll);
				setTopRated(tempTop);
				setPopular(popular);
				console.log("recommended");
				console.log(res.data.recommendedFiles);
				setRecommendedFiles(res.data.recommendedFiles);
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	}

	useEffect(() => {
		if (localStorage.getItem("token")) {
			sendRequest();
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
				loggedIn,
				setLoggedIn,
				isOpen,
				setIsOpen,
				recommendedFiles,
				allFiles,
				setAllFiles,
				popular,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
