import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
	FaThumbsUp,
	FaThumbsDown,
	FaDownload,
	FaEye,
	FaCalendarAlt,
	FaUser,
	FaFolder,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const ViewFile = () => {
	const { user } = useContext(AppContext);
	const { file_id } = useParams();
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);

	// Mocked file data (replace with actual data fetching)
	// Mocked file data (replace with actual data fetching)
	const file = {
		id: 1,
		name: "Example Document",
		// type: "pdf",
		type: "image",
		description: "An interesting document about physics",
		category: "Physics",
		// file: "https://www.fs.usda.gov/Internet/FSE_DOCUMENTS/stelprdb5166443.pdf",
		file: "http://127.0.0.1:8000/media/documents/birds.jpg",
		uploadedAt: new Date().toLocaleDateString(),
		uploadedBy: "John Doe",
		rating: 10,
		views: 20,
		downloads: 30,
	};

	const handleLike = () => {
		setLiked(!liked);
		setDisliked(false);
	};

	const handleDislike = () => {
		setDisliked(!disliked);
		setLiked(false);
	};

	//try this once for local backend files
	// const handleDownload = async () => {
	// 	try {
	// 		const response = await fetch(file.file);
	// 		const blob = await response.blob();
	// 		const url = window.URL.createObjectURL(blob);
	// 		const a = document.createElement("a");
	// 		a.style.display = "none";
	// 		a.href = url;
	// 		a.download = file.name;
	// 		document.body.appendChild(a);
	// 		a.click();
	// 		window.URL.revokeObjectURL(url);
	// 	} catch (error) {
	// 		console.error("Download failed:", error);
	// 	}
	// };

	const handleDownload = () => {
		// Implement download functionality
		console.log("Downloading file:", file.name);
		// You might want to use the actual file URL here
		window.open(file.file, "_blank");
	};

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
								value={file.uploadedBy}
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
							<FileInfoItem
								icon={<FaThumbsUp className="text-green-500" />}
								label="Rating"
								value={file.rating}
							/>
						</div>
						<p className="mt-4 text-gray-300 italic">{file.description}</p>
					</div>

					<div className="p-6">
						{file.type === "image" ? (
							<img
								src={file.file}
								alt={file.name}
								className="max-w-full h-auto rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
							/>
						) : (
							<iframe
								src={`${file.file}#toolbar=0`}
								className="w-full h-[600px] border-none rounded-lg shadow-lg"
								title={file.name}
							/>
						)}
					</div>

					<div className="p-6 border-t border-gray-700 flex justify-between items-center bg-gray-900">
						<div className="flex space-x-4">
							<ActionButton
								onClick={handleLike}
								active={liked}
								activeColor="text-green-500"
								icon={<FaThumbsUp />}
								text="Like"
							/>
							<ActionButton
								onClick={handleDislike}
								active={disliked}
								activeColor="text-red-500"
								icon={<FaThumbsDown />}
								text="Dislike"
							/>
						</div>
						<button
							onClick={handleDownload}
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						>
							<FaDownload />
							<span>Download</span>
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

const ActionButton = ({ onClick, active, activeColor, icon, text }) => (
	<button
		onClick={onClick}
		className={`flex items-center space-x-2 ${
			active ? activeColor : "text-gray-400"
		} hover:${activeColor} transition-colors duration-300`}
	>
		{icon}
		<span>{text}</span>
	</button>
);

export default ViewFile;
