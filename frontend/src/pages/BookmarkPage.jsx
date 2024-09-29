import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import FileCard from "../components/FileCard";
import { useAllBookmark } from "../hooks/useAllBookmark";
import { ChevronDown, ChevronUp } from "lucide-react";

const BookmarkPage = () => {
	const { files, loading } = useAllBookmark();
	const [expanded, setExpanded] = useState(false);

	const toggleExpand = () => {
		setExpanded((prev) => !prev);
	};

	const initialDisplayCount = window.innerWidth >= 768 ? 3 : 2;
	const displayedFiles = expanded ? files : files.slice(0, initialDisplayCount);

	return (
		<div className="flex bg-gray-800 min-h-screen">
			<Sidebar />
			<div className="flex-1 py-16 space-y-16 overflow-x-hidden ml-20">
				<div className="w-full px-6 lg:px-20">
					<h1 className="text-4xl font-bold text-white mb-10">
						Your Bookmarks
					</h1>
					{loading ? (
						<p className="text-white">Loading your bookmarks...</p>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32">
								{displayedFiles.map((file, index) => (
									<FileCard key={index} material={file} />
								))}
							</div>
							{files.length > initialDisplayCount && (
								<button
									onClick={toggleExpand}
									className="mt-6 flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
								>
									{expanded ? (
										<>
											<span className="mr-2">Show Less</span>
											<ChevronUp size={20} />
										</>
									) : (
										<>
											<span className="mr-2">Show More</span>
											<ChevronDown size={20} />
										</>
									)}
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookmarkPage;
