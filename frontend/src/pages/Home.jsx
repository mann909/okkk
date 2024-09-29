import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import images from "../assets";
import { AppContext } from "../context/AppContext";
import FileCard from "../components/FileCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const Home = () => {
	const [curImageIndex, setImageIndex] = useState(0);
	const { recommendedFiles, allFiles, topRated, popular } = useContext(
		AppContext
	);
	const [expanded, setExpanded] = useState({
		topRated: false,
		popular: false,
		recommended: false,
		allFiles: false,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const features = [
		{
			title: "Upload Study Material",
			msg:
				"Share your notes, presentations, and research papers. Contribute to the knowledge pool and help fellow students excel in their studies.",
			hashMsg1: "#KnowledgeSharing",
			hashMsg2: "#CommunityLearning",
		},
		{
			title: "Chat Rooms",
			msg:
				"Join topic-specific chat rooms to discuss ideas, share knowledge, and connect with peers and professionals in your field of interest.",
			hashMsg1: "#LiveDiscussions",
			hashMsg2: "#KnowledgeExchange",
		},
		{
			title: "Collaborative Learning",
			msg:
				"Engage in peer-to-peer learning communities. Share knowledge, solve problems together, and build a network of like-minded learners.",
			hashMsg1: "#TeamLearning",
			hashMsg2: "#PeerSupport",
		},
		{
			title: "LeaderBoard",
			msg:
				"Climb the ranks and showcase your expertise. Compete with peers, earn recognition, and track your progress in various subject areas.",
			hashMsg1: "#AcademyAchievement",
			hashMsg2: "#SkillShowcase",
		},
		{
			title: "Track Your Progress",
			msg:
				"Monitor your learning journey with detailed analytics. Set goals, visualize improvements, and celebrate milestones as you advance your skills.",
			hashMsg1: "#LearningAnalytics",
			hashMsg2: "#GrowthTracker",
		},
		{
			title: "Rating & Bookmarking",
			msg:
				"Rate study materials to help others find quality content. Bookmark your favorite resources for quick access and create personalized learning paths.",
			hashMsg1: "#QualityContent",
			hashMsg2: "#PersonalizedLearning",
		},
	];

	const toggleExpand = (section) => {
		setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
	};

	const FileSection = ({ title, files, section }) => {
		const initialDisplayCount = window.innerWidth >= 768 ? 3 : 2;
		const displayedFiles = expanded[section]
			? files
			: files.slice(0, initialDisplayCount);

		return (
			<div className="w-full py-12 px-6 lg:px-20 bg-gray-900 mb-8">
				<h2 className="text-3xl font-bold text-white mb-10">{title} : </h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ml-20 mt-20 gap-32">
					{displayedFiles.map((material, index) => (
						<FileCard key={index} material={material} />
					))}
				</div>
				{files.length > initialDisplayCount && (
					<button
						onClick={() => toggleExpand(section)}
						className="mt-6 flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
					>
						{expanded[section] ? (
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
			</div>
		);
	};

	return (
		<div className="flex bg-gray-800 min-h-screen">
			<Sidebar />
			<div className="flex-1 py-16 space-y-16 overflow-x-hidden ml-20">
				<div className="flex flex-col lg:flex-row items-center relative w-full px-6 lg:px-20">
					<div className="bg-gray-900 w-full h-auto p-8 flex flex-col items-start space-y-4 rounded-xl shadow-lg">
						<h1 className="text-4xl lg:text-5xl font-bold text-white lg:w-8/12 mb-4 leading-tight">
							Unlock Knowledge, Empower Learning
						</h1>
						<p className="text-gray-300 text-lg font-light mb-6 w-full lg:w-8/12">
							Discover a world of academic resources, collaborate with peers,
							and elevate your educational journey through our innovative
							E-Library platform.
						</p>
					</div>
					<div className="h-72 w-72 lg:w-6/12 hidden lg:block lg:absolute lg:right-0 overflow-hidden">
						{images.map((image, index) => (
							<img
								key={index}
								src={image}
								alt={`studentDoubt${index + 1}`}
								className={`absolute inset-0 w-9/12 h-full lg:translate-x-32 object-contain object-center transition-opacity ease-in-out duration-700 ${
									index === curImageIndex ? "opacity-100" : "opacity-0"
								}`}
							/>
						))}
					</div>
				</div>

				<div className="w-full px-6 lg:px-20">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-gray-900 h-auto rounded-xl text-white overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
							>
								<div className="p-6">
									<h3 className="font-bold text-xl mb-3">{feature.title}</h3>
									<p className="text-gray-300 text-base mb-4">{feature.msg}</p>
									<div className="flex flex-wrap">
										<span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
											{feature.hashMsg1}
										</span>
										<span className="inline-block bg-green-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
											{feature.hashMsg2}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-gray-900">
					{topRated && (
						<FileSection
							title="Top Rated"
							files={topRated}
							section="topRated"
						/>
					)}
					{popular && (
						<FileSection title="Popular" files={popular} section="popular" />
					)}
					{recommendedFiles && (
						<FileSection
							title="Recommended"
							files={recommendedFiles}
							section="recommended"
						/>
					)}
					{allFiles && (
						<FileSection
							title="All Files"
							files={allFiles}
							section="allFiles"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
