import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import phy from "../assets/physics.png";
// import chem from "../assets/Chemistry.jpg"
import images from "../assets/images"
import { FaEye } from "react-icons/fa";

const FileCard = ({ material }) => {

	const getCurrImage = (str) => {
		switch (str) {
			case "Physics":
				return images.phy;
			case "Chemistry":
				return images.chem;
			case "Mathematics":
				return images.math;
			case "Biology":
				return images.bio;
			case "Computer Science":
				return images.CS;
			case "English":
				return images.eng;
			case "Engineering":
				return images.engg;
			case "Economics":
				return images.eco;
			case "Geography":
				return images.geo;
			case "History":
				return images.history;
			case "Law":
				return images.law;
			case "Organic Chemistry":
				return images.orgChem;
			case "Political Science":
				return images.politicalScience;
			case "Psychology":
				return images.psy;
			default:
				return images.def; 
		}
	};
	
	const navigate = useNavigate();

	const currImg = getCurrImage(material.category.split(",")[0])

	return (
		<div className="w-64 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
			<div className="h-32 bg-gray-200 flex items-center justify-center">
				<img
					src={currImg}
					alt="File thumbnail"
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="p-4 flex-grow">
				<h3 className="text-xl font-semibold mb-2 truncate">{material.name}</h3>
				<p className="text-gray-600 text-sm mb-4 line-clamp-3">
					{material.description}
				</p>
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center">
						<i className="w-4 bx bxs-star h-4 text-yellow-400 text-base md:text-xl mb-3 mr-3" />
						<span className="text-sm font-medium">{material.rating}</span>
					</div>
					<div className="flex items-center">
						<FaEye className="text-cyan-500 text-base md:text-xl mr-3" />
						<span className="text-sm text-gray-500">{material.views}</span>
					</div>
				</div>
			</div>
			<button
				onClick={() => navigate(`/viewFile/${material.id}`)}
				className="w-full bg-blue-600 text-white py-3 px-4 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
			>
				<span className="mr-2">Go to File</span>
				<ArrowRight className="w-4 h-4" />
			</button>
		</div>
	);
};

export default FileCard;
