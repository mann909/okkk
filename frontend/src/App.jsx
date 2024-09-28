import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ChatPage from "./pages/ChatPage";
import ViewFile from "./pages/ViewFile";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/signin" element={<Signin />} />
					<Route path="/viewFile/:file_id" element={<ViewFile />} />
					<Route path="/chat/:chat_name" element={<ChatPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
