import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const UploadList = ({ uploads }) => {
	const navigate = useNavigate();

	return (
		<div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden max-h-[80vh] mt-10 ">
			<div className="sticky top-0 bg-gray-800 p-4 z-10">
				<div className="flex items-center justify-between">
					<div className="flex items-center text-white">
						<FileText size={20} className="mr-2" />
						<span className="text-lg font-medium">Uploads</span>
					</div>
				</div>
			</div>
			<div className="overflow-y-auto max-h-[calc(80vh-64px)] p-6">
				{uploads.map((file, index) => (
					<div
						key={index}
						className="bg-gray-800 hover:bg-gray-700 p-4 mb-2 cursor-pointer transition-all duration-300"
						onClick={() => navigate(`/viewFile/${file.id}`)}
					>
						<h2 className="text-lg font-medium text-white mb-2">
							{file.name.substring(0, Math.min(file.name.length, 80))}
							{file.name.length > 80 ? "..." : ""}
						</h2>
						<p className="text-sm text-gray-400">
							Posted on: {file.uploadedAt.split("T")[0]}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default UploadList;
