import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import image from "../assets/AuthImage.jpg";
import { LuEye, LuEyeOff, LuUser, LuLock } from "react-icons/lu";
import { AppContext } from "../context/AppContext";

const Signup = () => {
	const { setUser, setLoggedIn } = useContext(AppContext);
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [showC, setShowC] = useState(false);
	const [userInput, setUserInput] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	function handleChange(e, field) {
		setUserInput({
			...userInput,
			[field]: e.target.value,
		});
	}

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

	function checkPasswords() {
		if (userInput.password === userInput.confirmPassword) {
			sendRequest();
		} else {
			toast((t) => (
				<div className="flex justify-between bg-red-700 text-white p-4 rounded-md shadow-lg -mx-5 -my-3">
					<span className="font-bold">{"Passwords do not match"}</span>
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
		}
	}

	async function sendRequest() {
		console.log(userInput);
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
				name: userInput.name,
				email: userInput.email, // Ensure correct type
				password: userInput.password,
			});
			if (res.data.status !== 200) {
				toast((t) => (
					<div className="flex justify-between bg-red-700 text-white p-4 rounded-md shadow-lg -mx-5 -my-3">
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
			} else if (res.status === 200) {
				const jwt = res.data.jwt;
				console.log(jwt);
				// localStorage.setItem("token", jwt);
				toast("YOU HAVE SUCCESSFULLY LOGGED IN!", {
					icon: "✅",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
				setTimeout(() => {
					localStorage.setItem("token", jwt);
					setLoggedIn(true);
					setUser({
						name: res.data.name,
						email: res.data.email,
					});
					localStorage.setItem("loggedIn", "true");
					navigate("/");
					window.location.reload();
				}, 2000);
			} else {
				toast.error("Signup Failed");
			}
		} catch (error) {
			console.log(error);
			toast.error("Signup Failed");
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d2d] to-[#1a1a3a]">
			<Toaster />
			<div className="w-full max-w-4xl bg-[#1d1b31] rounded-2xl shadow-2xl overflow-hidden">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/2 p-12">
						<div className="text-center mb-10">
							<h2 className="text-4xl font-bold text-white mb-2">
								Create Account
							</h2>
							<p className="text-gray-400">Join us today!</p>
						</div>
						<form onSubmit={(e) => e.preventDefault()} className="space-y-6">
							<LabelledInput
								label="Name"
								placeholder="Enter your Name"
								value="name"
								onChange={(e) => handleChange(e, "name")}
								type="text"
								icon={<LuUser className="w-5 h-5 text-gray-400" />}
							/>
							<LabelledInput
								label="Email"
								placeholder="Enter your email"
								value="email"
								onChange={(e) => handleChange(e, "email")}
								type="text"
								icon={<LuUser className="w-5 h-5 text-gray-400" />}
							/>
							<div className="relative">
								<LabelledInput
									label="Password"
									placeholder="Set your password"
									value="password"
									onChange={(e) => handleChange(e, "password")}
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
							<div className="relative">
								<LabelledInput
									label="Confirm Password"
									placeholder="Confirm your password"
									value="confirmPassword"
									onChange={(e) => handleChange(e, "confirmPassword")}
									type={showC ? "text" : "password"}
									icon={<LuLock className="w-5 h-5 text-gray-400" />}
								/>
								{showC ? (
									<LuEye
										className="absolute text-2xl top-9 right-3 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
										onClick={() => setShowC(!showC)}
									/>
								) : (
									<LuEyeOff
										className="absolute text-2xl top-9 right-3 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
										onClick={() => setShowC(!showC)}
									/>
								)}
							</div>
							<button
								className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								onClick={checkPasswords}
							>
								Sign Up
							</button>
						</form>
						<p className="text-gray-400 text-center mt-8">
							Already have an account?{" "}
							<span
								onClick={() => navigate("/signin")}
								className="text-blue-400 hover:underline cursor-pointer"
							>
								Sign in here
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
									Welcome Back
								</h3>
								<p className="text-gray-200 mb-6">
									To keep connected with us please login with your personal info
								</p>
								<button
									onClick={() => navigate("/signin")}
									className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full font-semibold hover:bg-white hover:text-[#1d1b31] transition duration-300"
								>
									Sign In
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
	onChange,
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
					onChange={onChange}
					className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#2a2849] text-white placeholder-gray-400 transition duration-200"
				/>
			</div>
		</div>
	);
};

export default Signup;
