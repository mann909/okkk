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
	});
	const [loggedIn, setLoggedIn] = useState(false);

	async function sendRequest() {
		try {
			const res = await axios.get(`${BACKEND_URL}/api/v1/user/getUser`, {
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			if (res.data) {
				setLoggedIn(true);
				const temp = res.data.user;
				console.log("Fetched user:", temp); // Logging fetched data
				setUser(temp); // Update the state
				user.id = temp.id;
				user.name = temp.name;
				user.email = temp.email;
				setUser(user);
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
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
