import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import FileCard2 from "../components/FileCard2";
import { Search, Filter, X } from "lucide-react";

const categories = [
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

const AllFiles = () => {
	const { allFiles } = useContext(AppContext);
	const [search, setSearch] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [filteredFiles, setFilteredFiles] = useState([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	useEffect(() => {
		applyFilter();
	}, [allFiles, search, selectedCategories]);

	const applyFilter = () => {
		let filtered = allFiles;

		if (search) {
			filtered = filtered.filter(
				(file) =>
					file.name.toLowerCase().includes(search.toLowerCase()) ||
					file.description.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (selectedCategories.length > 0) {
			filtered = filtered.filter((file) =>
				selectedCategories.some((category) =>
					file.category
						.split(",")
						.map((cat) => cat.trim())
						.includes(category)
				)
			);
		}

		setFilteredFiles(filtered);
	};

	const toggleCategory = (category) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category]
		);
	};

	const toggleFilter = () => {
		setIsFilterOpen(!isFilterOpen);
	};

	return (
		<div className="flex bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
			<Sidebar />
			<div className="flex-1 flex flex-col pl-[5rem] sm:pl-[5rem]">
				<div className="fixed top-0 left-[5rem] sm:left-[5rem] right-0 z-10 bg-gray-800 bg-opacity-90 backdrop-blur-md p-4 shadow-lg">
					<div className="max-w-7xl mx-auto">
						<h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
							All Files
						</h1>
						<div className="flex flex-wrap gap-4 items-center mb-4">
							<div className="flex-grow relative">
								<input
									type="text"
									className="w-full px-4 py-2 pr-10 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Search files..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
								<Search
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={20}
								/>
							</div>
							<div className="relative">
								<button
									className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
									onClick={toggleFilter}
								>
									<Filter size={18} className="mr-2" />
									Categories
								</button>
								{isFilterOpen && (
									<div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl">
										<div className="p-2 max-h-60 overflow-y-auto">
											{categories.map((category) => (
												<label
													key={category}
													className="flex items-center p-2 hover:bg-gray-700"
												>
													<input
														type="checkbox"
														checked={selectedCategories.includes(category)}
														onChange={() => toggleCategory(category)}
														className="mr-2"
													/>
													<span className="text-white">{category}</span>
												</label>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
						{selectedCategories.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-4">
								{selectedCategories.map((category) => (
									<span
										key={category}
										className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
									>
										{category}
										<X
											size={14}
											className="ml-2 cursor-pointer"
											onClick={() => toggleCategory(category)}
										/>
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 mt-80 sm:mt-56 md:mt-48 mb-8 overflow-y-auto px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
					{filteredFiles.length > 0 ? (
						filteredFiles.map((file) => <FileCard2 key={file.id} file={file} />)
					) : (
						<div className="text-white text-center mt-8">No files found.</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AllFiles;
