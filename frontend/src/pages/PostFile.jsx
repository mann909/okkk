import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
// import Sidebar from "../components/Sidebar";

const PostFile = () => {
	const navigate = useNavigate();
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const { user } = useContext(AppContext);
	const [file, setFile] = useState(null);

	const [fileInfo, setFileInfo] = useState({
		name: "",
		type: "None",
		description: "",
		category: "None",
	});

	useEffect(() => {
		if (localStorage.getItem("loggedIn") === "false") navigate("/signin");
	}, [navigate]);

	async function sendRequest(e) {
		console.log(file);
		e.preventDefault();
		if (fileInfo.name === "") {
			toast.error("Please enter your file name");
			return;
		}
		if (fileInfo.type === "None") {
			toast.error("Please select the file type");
			return;
		}
		if (fileInfo.description === "") {
			toast.error("Please write some description for your file");
			return;
		}
		if (fileInfo.category === "None") {
			toast.error("Please select a category");
			return;
		}

		console.log(user);
		const formData = new FormData();
		formData.append("user_id", user.id);

		for (const key in fileInfo) {
			if (fileInfo.hasOwnProperty(key)) {
				formData.append(key, fileInfo[key]);
			}
		}
		formData.append("file", file);

		try {
			console.log("INSIDE");
			const res = await axios.post(
				`${BACKEND_URL}/api/v1/file/postFile`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (res.data.status !== 200) {
				toast.error(res.data.message);
			} else {
				toast.success("File Uploaded successfully");
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to upload File");
		}
	}

	// For category dropdown

	const [selectedOptions, setSelectedOptions] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [displayText, setDisplayText] = useState("Select subjects");
	const dropdownRef = useRef(null);

	const options = [
		"Fiction",
		"Mystery",
		"Thriller",
		"Science Fiction",
		"Fantasy",
		"Historical",
		"Biography",
		"Self-Help",
		"Romance",
		"Horror",
		"Adventure",
		"Philosophy",
		"Children's",
		"Young Adult",
		"Poetry",
		"Graphic Novel",
		"Drama",
		"Humor",
		"Spirituality",
		"Education",
		"Health",
		"Business",
		"Travel",
		"Cooking",
		"Art",
		"History",
		"Science",
		"Religion",
		"Sports",
		"Technology",
	];

	// Handle outside click to close the dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
				updateDisplayText();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [selectedOptions]);

	// Update the display text when selected options change
	const updateDisplayText = () => {
		if (selectedOptions.length > 0) {
			setDisplayText(selectedOptions.join(", "));
			setFileInfo({
				...fileInfo,
				category: selectedOptions.join(", "),
			});
		} else {
			setDisplayText("Select subjects");
		}
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleOptionChange = (option) => {
		if (selectedOptions.includes(option)) {
			// Remove option if already selected
			setSelectedOptions(selectedOptions.filter((item) => item !== option));
		} else {
			// Add option if not selected
			setSelectedOptions([...selectedOptions, option]);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-[#1d1b31]">
			<Toaster />
			<Sidebar />
			<div className="w-full max-w-lg p-8 bg-[#11101d] shadow-2xl rounded-lg border border-[#2e2c4e]">
				<h1 className="text-3xl font-bold mb-6 text-center text-white">
					Post Your Material
				</h1>
				<form onSubmit={sendRequest} className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-400 mb-2"
						>
							Material Name :
						</label>
						<input
							id="name"
							type="text"
							className="w-full px-3 py-2 border-2 border-[#2e2c4e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e4b73] bg-[#1d1b31] text-white resize-none"
							placeholder="Write your file name here..."
							onChange={(e) =>
								setFileInfo({
									...fileInfo,
									name: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label
							htmlFor="type"
							className="block text-sm font-medium text-gray-400 mb-2"
						>
							Select the type for your file:
						</label>
						<select
							id="type"
							className="w-full px-3 py-2 border-2 border-[#2e2c4e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e4b73] bg-[#1d1b31] text-white"
							onChange={(e) =>
								setFileInfo({
									...fileInfo,
									type: e.target.value,
								})
							}
						>
							<option value="None">None</option>
							<option value="image">Image</option>
							<option value="pdf">Pdf</option>
						</select>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-400 mb-2"
						>
							Write a brief description:
						</label>
						<textarea
							id="description"
							rows="5"
							className="w-full px-3 py-2 border-2 border-[#2e2c4e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e4b73] bg-[#1d1b31] text-white resize-none"
							placeholder="Describe your file here..."
							onChange={(e) =>
								setFileInfo({
									...fileInfo,
									description: e.target.value,
								})
							}
						/>
					</div>
					<div className="relative" ref={dropdownRef}>
						<label
							htmlFor="category"
							className="w-full block text-sm font-medium text-gray-400 mb-2"
						>
							Select the categories for your doubt:
						</label>
						<div
							onClick={toggleDropdown}
							className="w-full px-3 py-2 border-2  border-[#2e2c4e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e4b73] bg-[#1d1b31] text-white cursor-pointer"
						>
							{displayText}
						</div>

						{isDropdownOpen && (
							<div className="absolute w-full mt-1 h-40 overflow-x-auto  bg-[#1d1b31] border-2 border-[#2e2c4e] rounded-md">
								{options.map((option) => (
									<div key={option} className="w-full hover:bg-[#0f0e1a]">
										<label className="w-full inline-flex items-center ">
											<input
												type="checkbox"
												className="form-checkbox text-[#4e4b73] bg-[#2e2c4e] border-gray-500 "
												checked={selectedOptions.includes(option)}
												onChange={() => handleOptionChange(option)}
											/>
											<span className="w-full ml-2 text-white">{option}</span>
										</label>
									</div>
								))}
							</div>
						)}
					</div>

					<div>
						<div>
							<label
								htmlFor="file"
								className="block text-sm font-medium text-gray-400 mb-2"
							>
								Choose File :
							</label>
							<input
								type="file"
								id="file"
								accept="file/*"
								onChange={(e) => {
									console.log(e.target.files[0]);
									setFile(e.target.files[0]);
								}}
							/>
						</div>
					</div>

					<div className="text-center">
						<button
							type="submit"
							className="w-full mt-4 px-4 py-2 bg-[#4e4b73] text-white font-semibold rounded-md hover:bg-white hover:text-[#1d1b31] transition-colors border border-[#2e2c4e]"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostFile;
