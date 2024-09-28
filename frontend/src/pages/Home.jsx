import { React, useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import images from "../assets";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import FileCard from "../components/FileCard";

const Home = () => {
	const [curImageIndex, setImageIndex] = useState(0);
	const { recommendedFiles, allFiles, topRated, popular } = useContext(
		AppContext
	);

	if (popular) {
		console.log("got popular");
		console.log(popular);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	// const topRated = [
	// 	{
	// 		id: 1,
	// 		title: "Introduction to React",
	// 		subject: "Web Development",
	// 		rating: 4.5,
	// 	},
	// 	{ id: 2, title: "Advanced Calculus", subject: "Mathematics", rating: 4.8 },
	// 	{
	// 		id: 3,
	// 		title: "Organic Chemistry Basics",
	// 		subject: "Chemistry",
	// 		rating: 4.2,
	// 	},
	// 	{
	// 		id: 4,
	// 		title: "World History: 20th Century",
	// 		subject: "History",
	// 		rating: 4.6,
	// 	},
	// 	{
	// 		id: 5,
	// 		title: "Machine Learning Fundamentals",
	// 		subject: "Computer Science",
	// 		rating: 4.7,
	// 	},
	// ];

	return (
		<>
			<Sidebar />
			<div className="bg-gray-800 min-h-screen py-16 space-y-32 flex flex-col overflow-hidden">
				<div className="flex flex-col lg:flex-row items-center relative mr-4  w-screen">
					<div className="bg-[#11101d]  w-screen h-auto p-8 flex flex-col items-start space-y-4">
						<h1 className="text-4xl ml-20 lg:text-5xl font-bold text-white lg:w-6/12 mb-4">
							Unlock Knowledge, Empower Learning
						</h1>
						<p className="text-gray-300 ml-20 font-light mb-6 w-7/12 lg:w-6/12">
							Discover a world of academic resources, collaborate with peers,
							and elevate your educational journey through our innovative
							E-Library platform.
						</p>
					</div>
					<div className="h-72 w-72 lg:w-6/12 hidden lg:block lg:z-10 ml-20 lg:h-96 lg:absolute relative lg:right-0  overflow-hidden">
						{images.map((image, index) => (
							<img
								src={image}
								alt={`studentDoubt${index + 1}`}
								className={`absolute inset-0 w-9/12 h-full lg:translate-x-32 object-contain object-center transition-opacity ease-in-out duration-700 ${
									index === curImageIndex ? "opacity-100" : "opacity-0"
								}`}
								key={index}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col lg:flex-row items-center relative w-full">
					<div className="bg-[#11101d] w-full h-auto lg:h-auto px-4 lg:px-20 py-16">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ml-20">
							{[
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
							].map((cards, index) => {
								return (
									<div
										key={index}
										className="bg-white h-auto rounded-xl text-[#11101d] overflow-hidden shadow-lg"
									>
										<div className="p-6">
											<h3 className="font-bold text-xl mb-2">{cards.title}</h3>
											<p className="text-gray-700 text-base">{cards.msg}</p>
										</div>
										<div className="px-6 pt-4 pb-2">
											<span className="inline-block bg-[#11101d] rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
												{cards.hashMsg1}
											</span>
											<span className="inline-block bg-[#11101d] rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
												{cards.hashMsg2}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				{topRated && (
					<div className="bg-[#11101d] w-full py-16 px-4 lg:px-20">
						<h2 className="text-3xl font-bold text-white mb-8 ml-20">
							Top Rated :
						</h2>
						<div className="flex overflow-x-scroll no-scrollbar space-x-6 pb-6 ml-20">
							{topRated.map((material, index) => (
								<FileCard key={index} material={material} />
							))}
						</div>
					</div>
				)}

				{popular && (
					<div className="bg-[#11101d] w-full py-16 px-4 lg:px-20">
						<h2 className="text-3xl font-bold text-white mb-8 ml-20">
							Popular :
						</h2>
						<div className="flex overflow-x-scroll no-scrollbar space-x-6 pb-6 ml-20">
							{popular.map((material, index) => (
								<FileCard key={index} material={material} />
							))}
						</div>
					</div>
				)}

				{recommendedFiles && (
					<div className="bg-[#11101d] w-full py-16 px-4 lg:px-20">
						<h2 className="text-3xl font-bold text-white mb-8 ml-20">
							Recommended :
						</h2>
						<div className="flex overflow-x-scroll no-scrollbar space-x-6 pb-6 ml-20">
							{recommendedFiles.map((material, index) => (
								<FileCard key={index} material={material} />
							))}
						</div>
					</div>
				)}

				{allFiles && (
					<div className="bg-[#11101d] w-full py-16 px-4 lg:px-20">
						<h2 className="text-3xl font-bold text-white mb-8 ml-20">
							All Files :
						</h2>
						<div className="flex overflow-x-scroll no-scrollbar space-x-6 pb-6 ml-20">
							{allFiles.map((material, index) => (
								<FileCard key={index} material={material} />
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Home;
