import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import StatsCard1 from "../components/StatsCard1";
import StatsCard2 from "../components/StatsCard2";
import Sidebar from "../components/Sidebar";
import { useUser } from "../hooks/useUser";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useFiles } from "../hooks/useFiles";
import UploadList from "../components/UploadList";
import HeatMap from "../components/Heatmap";

const Dashboard = () => {
	const { user_id } = useParams();
	const { user } = useUser({ user_id });
	const { files } = useFiles({ user_id });
	const [uploads, setUploads] = useState([]);
	const [temp, setTemp] = useState([]);
	const [gotFile, setGotFile] = useState(false);

	// Ensure that the uploads variable has a default empty array if no files are loaded
	useEffect(() => {
		setTemp(files);
		setGotFile(true);
	}, [files]);

	useEffect(() => {
		if (gotFile) {
			setUploads(temp);
			console.log("upload changed final");
			console.log(uploads);
		}
	}, [gotFile, temp]);
	// Ensure user data has a default object if not yet loaded
	const data = user || {};

	// Show loading screen if either user or files are still being fetched
	// if (uploads.length == 0) {
	// 	return <Loading />;
	// }

	// Render the dashboard once data is available
	return (
		<div className="bg-gray-800">
			<div className="flex justify-center min-h-screen bg-gray-800 p-4 ml-[4rem] sm:ml-24 md:ml-20 lg:ml-1">
				<Sidebar />
				<div className="flex flex-col md:flex-row justify-center items-start bg-gray-800 rounded-xl p-6 max-w-6xl w-full mx-auto space-y-4 md:space-y-0 md:space-x-8">
					{/* Profile Card */}
					<div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 mr-8">
						<ProfileCard
							name={data.name || "Unknown"}
							email={data.email || "N/A"}
							ratings={data.ratings || 0}
							views={data.views || 0}
							uploads={uploads.length || 0}
							gender={data.gender || "Not Specified"}
							user_id={user_id}
						/>
					</div>

					{/* Stats and Text Area */}
					<div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-between">
						{/* Stats Cards at the top */}
						<div className="flex flex-wrap sm:flex-nowrap items-start gap-2 mb-4">
							<StatsCard uploads={uploads.length || 0} />
							<StatsCard1 ratings={data.ratings || 0} />
							<StatsCard2 views={data.views || 0} />
						</div>

						{/* Heatmap Area */}
						<HeatMap uploads={uploads} />

						<UploadList uploads={uploads} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
