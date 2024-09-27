import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import image from "../assets/AuthImage.jpg";
import { LuEye, LuEyeOff, LuUser, LuLock } from "react-icons/lu";
import { AppContext } from "../context/AppContext";

const Signin = () => {
	const { setLoggedIn, setUser } = useContext(AppContext);
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [userInput, setUserInput] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e, field) => {
		setUserInput({
			...userInput,
			[field]: e.target.value,
		});
	};

	useEffect(() => {
		if (localStorage.getItem("loggedIn") === "true") navigate("/");
		const token = localStorage.getItem("token");
		if (token) {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const expiration = new Date(payload.exp * 1000);
			const now = new Date();

			if (now >= expiration) {
				localStorage.removeItem("token");
				localStorage.setItem("loggedIn", "false");
				navigate("/signin");
				toast.error("Session expired, please log in again.");
			} else {
				// Set a timeout to remove the token just before it expires
				const timeout = expiration.getTime() - now.getTime();
				setTimeout(() => {
					localStorage.removeItem("token");
					localStorage.setItem("loggedIn", "false");
					navigate("/signin");
					toast.error("Session expired, please log in again.");
				}, timeout);
			}
		}
	}, [navigate]);

	const sendRequest = async () => {
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
				email: userInput.email, // Ensure correct type
				password: userInput.password,
			});
			console.log(res);
			if (!res.data.jwt) {
				toast((t) => (
					<div className="flex justify-between bg-red-700 text-white p-4 rounded-md shadow-lg -mx-5 -my-3 w-96">
						<span className="font-bold">{res.data.message}</span>
						<button
							className="ml-2 text-red-500"
							onClick={() => {
								toast.dismiss(t.id);
							}}
						>
							❌
						</button>
					</div>
				));
			} else if (res) {
				const jwt = res.data.jwt;
				localStorage.setItem("token", jwt);
				toast("YOU HAVE SUCCESSFULLY LOGGED IN!", {
					icon: "✅",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
				setTimeout(() => {
					setLoggedIn(true);
					setUser({
						name: res.data.name,
						email: res.data.email,
					});
					localStorage.setItem("loggedIn", "true");
					window.location.reload();
					navigate("/");
				}, 1000);
			} else {
				alert(res.data.message);
			}
		} catch (error) {
			alert("Error while sending request");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d2d] to-[#1a1a3a]">
			<Toaster />
			<div className="w-full max-w-4xl bg-[#1d1b31] rounded-2xl shadow-2xl overflow-hidden">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/2 p-12">
						<div className="text-center mb-10">
							<h2 className="text-4xl font-bold text-white mb-2">
								Welcome Back
							</h2>
							<p className="text-gray-400">Sign in to your account</p>
						</div>
						<form onSubmit={(e) => e.preventDefault()} className="space-y-6">
							<LabelledInput
								label="Email"
								placeholder="Enter your email"
								value="email"
								onchange={(e) => handleChange(e, "email")}
								icon={<LuUser className="w-5 h-5 text-gray-400" />}
							/>
							<div className="relative">
								<LabelledInput
									label="Password"
									placeholder="Enter your password"
									value="password"
									onchange={(e) => handleChange(e, "password")}
									type={show ? "text" : "password"}
									icon={<LuLock className="w-5 h-5 text-gray-400" />}
								/>
								{show ? (
									<LuEye
										className="absolute text-2xl top-9 right-3 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
										onClick={() => setShow(!show)}
									/>
								) : (
									<LuEyeOff
										className="absolute text-2xl top-9 right-3 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
										onClick={() => setShow(!show)}
									/>
								)}
							</div>
							<button
								className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								onClick={sendRequest}
							>
								Sign In
							</button>
						</form>
						<p className="text-gray-400 text-center mt-8">
							Don't have an account?{" "}
							<span
								onClick={() => navigate("/signup")}
								className="text-blue-400 hover:underline cursor-pointer"
							>
								Sign up here
							</span>
						</p>
					</div>
					<div className="hidden md:block w-1/2 relative">
						<img
							src={image}
							alt="Auth"
							className="absolute inset-0 w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="text-center">
								<h3 className="text-white text-3xl font-bold mb-4">
									New Here?
								</h3>
								<p className="text-gray-200 mb-6">
									Sign up and discover a great amount of new opportunities!
								</p>
								<button
									onClick={() => navigate("/signup")}
									className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full font-semibold hover:bg-white hover:text-[#1d1b31] transition duration-300"
								>
									Sign Up
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<RxCross2
				className="absolute top-5 right-5 text-white text-3xl hover:text-gray-300 cursor-pointer transition-colors duration-200"
				onClick={() => navigate("/")}
			/>
		</div>
	);
};

const LabelledInput = ({
	label,
	placeholder,
	onchange,
	value,
	type = "text",
	icon,
}) => {
	return (
		<div className="flex flex-col mb-4">
			<label className="mb-2 text-sm font-medium text-gray-300" htmlFor={value}>
				{label}
			</label>
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					{icon}
				</div>
				<input
					placeholder={placeholder}
					type={type}
					id={value}
					onChange={onchange}
					className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#2a2849] text-white placeholder-gray-400 transition duration-200"
				/>
			</div>
		</div>
	);
};

export default Signin;
