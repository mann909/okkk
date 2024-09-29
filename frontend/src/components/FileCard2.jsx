import React from "react";
import { Star, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const FileCard2 = ({ file }) => {
	const navigate = useNavigate();

	return (
		<div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
			<div className="p-6">
				<h3 className="text-xl font-semibold mb-2 text-white truncate">
					{file.name}
				</h3>
				<p className="text-gray-300 text-sm mb-4 line-clamp-2">
					{file.description}
				</p>
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center space-x-4">
						<span className="text-sm font-medium text-blue-400">
							{file.category}
						</span>
						<div className="flex items-center">
							<i className="w-4 bx bxs-star h-4 text-yellow-400 text-base md:text-xl mb-3 mr-3" />
							<span className="text-sm font-medium text-gray-300">
								{file.rating}
							</span>
						</div>
						<div className="flex items-center">
							<FaEye className="text-cyan-500 text-base md:text-xl mr-3" />
							<span className="text-sm text-gray-400">{file.views}</span>
						</div>
					</div>
					<button
						onClick={() => navigate(`/viewFile/${file.id}`)}
						className="bg-blue-600 text-white py-2 px-4 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
					>
						<span className="mr-2">View</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FileCard2;
