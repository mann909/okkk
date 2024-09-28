const FileCard = ({ material }) => {
	return (
		<div className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden">
			<div className="p-6">
				<h3 className="font-bold text-xl mb-2 text-[#11101d]">
					{material.name}
				</h3>
				<p className="text-gray-600 mb-4">{material.description}</p>
				<div className="flex items-center">
					<span className="text-yellow-500 mr-1">★</span>
					<span className="text-gray-700">{material.rating}</span>
				</div>
			</div>
		</div>
	);
};

export default FileCard;
