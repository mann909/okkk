import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ChatPage from "./pages/ChatPage";
import ViewFile from "./pages/ViewFile";
import PostFile from "./pages/PostFile";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import BookmarkPage from "./pages/BookmarkPage";
import AllUsers from "./pages/AllUsers";
import Chatrooms from "./pages/Chatrooms";
import AllFiles from "./pages/AllFiles";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/signin" element={<Signin />} />
					<Route path="/postFile" element={<PostFile />} />
					<Route path="/viewFile/:file_id" element={<ViewFile />} />
					<Route path="/chat/:chat_name" element={<ChatPage />} />
					<Route path="/" element={<Home />} />
					<Route path="/dashboard/:user_id" element={<Dashboard />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/bookmarks" element={<BookmarkPage />} />
					<Route path="/allUsers" element={<AllUsers />} />
					<Route path="/chatrooms" element={<Chatrooms />} />
					<Route path="/allFiles" element={<AllFiles />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
