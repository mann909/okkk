import React, { useState, useEffect, useContext } from "react";
import male from "../assets/male.png";
import female from "../assets/female.png";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const ProfileCard = ({
	name,
	email,
	gender,
	ratings,
	views,
	uploads,
	user_id,
}) => {
	const [selectedGender, setSelectedGender] = useState(gender);
	const [showDialog, setShowDialog] = useState(false);
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const { user } = useContext(AppContext);
	const [showGender, setShowGender] = useState(false);

	useEffect(() => {
		if (gender) {
			setSelectedGender(gender);
		}
	}, [gender]);

	useEffect(() => {
		console.log(user);
		if (user) {
			if (user.id == user_id && !gender) {
				setShowGender(true);
			} else {
				setShowGender(false);
			}
		}
	}, [user, selectedGender]);

	const handleGenderSelection = async (gen) => {
		setSelectedGender(gen);
		setShowDialog(false);
		try {
			const response = await axios.post(
				`${BACKEND_URL}/api/v1/user/setGender`,
				{ gender: gen },
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			if (response.status === 200) {
				toast.success("Gender updated successfully");
			} else {
				toast.error("Error while updating");
			}
		} catch (error) {
			console.error("Error updating gender:", error);
			toast.error("Error updating gender");
		}
	};

	return (
		<div className="bg-gray-900 text-white p-6 md:p-8 rounded-xl shadow-lg w-full md:max-w-xs flex-shrink-0">
			<div className="flex flex-col items-center mb-6">
				{selectedGender ? (
					<img
						src={selectedGender === "male" ? male : female}
						alt={`${selectedGender} avatar`}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-white flex items-center justify-center mb-4 bg-black text-white text-3xl md:text-5xl font-bold shadow-glow overflow-hidden">
						{name.charAt(0)}
					</div>
				)}

				{showGender && (
					<button
						className="mt-2 border border-white rounded px-4 py-2 mb-4"
						onClick={() => setShowDialog(true)}
					>
						Select Gender
					</button>
				)}

				{showDialog && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-white text-black p-4 rounded-lg shadow-lg w-72">
							<div className="mb-4">
								<h2 className="text-xl font-bold">Choose your gender</h2>
								<p className="text-sm text-gray-600">
									Select an image to represent your gender. This will update
									your profile.
								</p>
							</div>
							<div className="flex justify-end space-x-2">
								<button
									className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
									onClick={() => setShowDialog(false)}
								>
									Cancel
								</button>
								<button
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									onClick={() => handleGenderSelection("male")}
								>
									Male
								</button>
								<button
									className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
									onClick={() => handleGenderSelection("female")}
								>
									Female
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="text-center">
					<h2 className="text-xl md:text-2xl font-bold">{name}</h2>
				</div>
			</div>
			<div className="border-t border-gray-800 pt-4 md:pt-6">
				<h3 className="text-lg md:text-xl font-semibold text-start mb-4">
					Community Stats
				</h3>
				<div className="space-y-4 ml-2 mt-2">
					<div className="text-center flex items-start">
						<i className="bx bx-file text-blue-500 text-base md:text-xl mr-3"></i>
						<div className="text-justify">
							<p className="text-sm md:text-base">
								Uploads: <span className="font-bold">{uploads}</span>
							</p>
						</div>
					</div>
					<div className="text-center flex items-start">
						<i className="bx bx-check-circle text-green-500 text-base md:text-xl mr-3"></i>
						<div className="text-justify">
							<p className="text-sm md:text-base">
								Ratings: <span className="font-bold">{ratings}</span>
							</p>
						</div>
					</div>
					<div className="text-center flex items-start">
						<i className="bx bx-like text-cyan-500 text-base md:text-xl mr-3"></i>
						<div className="text-justify">
							<p className="text-sm md:text-base">
								Views: <span className="font-bold">{views}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
