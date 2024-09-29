import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
	FaDownload,
	FaEye,
	FaCalendarAlt,
	FaUser,
	FaFolder,
	FaStar,
	FaBookmark,
	FaRegBookmark,
} from "react-icons/fa"; // Import bookmark icons
import Sidebar from "../components/Sidebar";
import { useViewFile } from "../hooks/useViewFile";
import Loading from "../components/Loading";
import axios from "axios";

const ViewFile = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const { user } = useContext(AppContext);
	const { file_id } = useParams();
	const { file, isLoading } = useViewFile({ file_id });
	const [rating, setRating] = useState(0);
	const [prevRating, setPrevRating] = useState(0);
	const [isRatingLoaded, setIsRatingLoaded] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false); // State for bookmark

	if (file) {
		console.log("file details");
		console.log(file);
		console.log(`${BACKEND_URL}${file.file}`);
	}

	async function sendViewsRequest() {
		if (file && user) {
			try {
				const response = await axios.put(
					`${BACKEND_URL}/api/v1/file/updateViews`,
					{
						id: parseInt(file_id),
					},
					{
						headers: {
							Authorization: `${localStorage.getItem("token")}`,
						},
					}
				);

				if (response.data.status === 200) {
					console.log("Views updated successfully:", response.data);
				} else {
					console.error("Failed to update Views:", response.data.message);
				}
			} catch (error) {
				console.error("Error updating Views:", error);
			}
		}
	}

	useEffect(() => {
		sendViewsRequest();
	}, [file]);

	const loadUserRating = () => {
		if (user && user.ratingList && Array.isArray(user.ratingList)) {
			const userRating = user.ratingList.find(
				(item) => item.file_id === parseInt(file_id)
			);
			if (userRating) {
				setRating(userRating.rating);
				setPrevRating(userRating.rating);
			}
			setIsRatingLoaded(true);
		} else {
			console.log("User ratingList is not available or not an array");
		}
	};

	const loadBookmark = () => {
		if (user && user.bookmarkList && Array.isArray(user.bookmarkList)) {
			const bookmark = user.bookmarkList.find(
				(item) => item.file_id === parseInt(file_id)
			);
			if (bookmark) {
				setIsBookmarked(true);
			}
		}
	};

	useEffect(() => {
		loadUserRating();
	}, [user.ratingList]);

	useEffect(() => {
		loadBookmark();
	}, [user.bookmarkList]);

	const handleRating = async (newRating) => {
		setRating(newRating);
		try {
			const response = await axios.put(
				`${BACKEND_URL}/api/v1/file/updateRating`,
				{
					id: parseInt(file_id),
					prevRating: prevRating,
					newRating: newRating,
				},
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				}
			);

			if (response.data.status === 200) {
				setPrevRating(newRating);
			} else {
				console.error("Failed to update rating:", response.data.message);
				setRating(prevRating); // Revert to previous rating if update fails
			}
		} catch (error) {
			console.error("Error updating rating:", error);
			setRating(prevRating); // Revert to previous rating if update fails
		}
	};

	const handleDownload = () => {
		console.log("Downloading file:", file.name);
		window.open(`${BACKEND_URL}${file.file}`, "_blank");
	};

	// Function to toggle bookmark
	const toggleBookmark = async () => {
		if (user) {
			try {
				const response = await axios.put(
					`${BACKEND_URL}/api/v1/user/updateBookmarkList`,
					{
						id: parseInt(file_id),
					},
					{
						headers: {
							Authorization: `${localStorage.getItem("token")}`,
						},
					}
				);

				if (response.data.status === 200) {
					setIsBookmarked((prev) => !prev); // Toggle bookmark state
				} else {
					console.error("Failed to update bookmark:", response.data.message);
				}
			} catch (error) {
				console.error("Error updating bookmark:", error);
			}
		}
	};

	useEffect(() => {
		// Check if the file is already bookmarked
		if (user && user.bookMarkList) {
			const isAlreadyBookmarked = user.bookMarkList.some(
				(bookmark) => bookmark.file_id === parseInt(file_id)
			);
			setIsBookmarked(isAlreadyBookmarked);
		}
	}, [user, file_id]);

	if (isLoading || !isRatingLoaded) {
		return <Loading />;
	}

	if (!file.name) {
		return <div>Error: File not found</div>;
	}

	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
			<Sidebar />
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
					<div className="p-6 border-b border-gray-700">
						<h1 className="text-3xl font-bold mb-4 text-blue-400">
							{file.name}
						</h1>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<FileInfoItem
								icon={<FaFolder className="text-yellow-500" />}
								label="Category"
								value={file.category}
							/>
							<FileInfoItem
								icon={<FaUser className="text-green-500" />}
								label="Uploaded by"
								value={file.uploadedBy.name}
							/>
							<FileInfoItem
								icon={<FaCalendarAlt className="text-red-500" />}
								label="Uploaded at"
								value={file.uploadedAt}
							/>
							<FileInfoItem
								icon={<FaEye className="text-purple-500" />}
								label="Views"
								value={file.views}
							/>
							<FileInfoItem
								icon={<FaDownload className="text-blue-500" />}
								label="Downloads"
								value={file.downloads}
							/>
							<div className="flex items-center space-x-2">
								<FaStar className="text-yellow-500" />
								<span className="font-semibold">Average Rating:</span>
								<span className="text-gray-300">
									{file.rating ? file.rating.toFixed(1) : "N/A"}
								</span>
							</div>
						</div>
						<p className="mt-4 text-gray-300 italic">{file.description}</p>
					</div>

					<div className="p-6">
						{file.type === "image" ? (
							<img
								src={`${BACKEND_URL}${file.file}`}
								alt={file.name}
								className="max-w-full h-auto rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
							/>
						) : (
							<iframe
								src={`${BACKEND_URL}${file.file}#toolbar=0`}
								className="w-full h-[600px] border-none rounded-lg shadow-lg"
								title={file.name}
							/>
						)}
					</div>

					<div className="p-6 border-t border-gray-700 flex justify-between items-center bg-gray-900">
						<div className="flex items-center space-x-4">
							<span className="text-gray-300">Your Rating:</span>
							<StarRating rating={rating} onRate={handleRating} />
						</div>
						<button
							onClick={handleDownload}
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						>
							<FaDownload />
							<span>Download</span>
						</button>
						<button
							onClick={toggleBookmark}
							className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
						>
							{isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
							<span>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const FileInfoItem = ({ icon, label, value }) => (
	<div className="flex items-center space-x-2">
		{icon}
		<span className="font-semibold">{label}:</span>
		<span className="text-gray-300">{value}</span>
	</div>
);

const StarRating = ({ rating, onRate }) => {
	return (
		<div className="flex">
			{[1, 2, 3, 4, 5].map((star) => (
				<FaStar
					key={star}
					className={`cursor-pointer text-2xl ${
						star <= rating ? "text-yellow-500" : "text-gray-400"
					} hover:text-yellow-500 transition-colors duration-150`}
					onClick={() => onRate(star)}
				/>
			))}
		</div>
	);
};

export default ViewFile;
