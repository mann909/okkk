import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
// import male from "../assets/male.png";
// import female from "../assets/female.png";

const Sidebar = () => {
	const { isOpen, setIsOpen, user } = useContext(AppContext);

	const navigate = useNavigate();

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/signin");
			window.location.reload();
		}
		if (token) {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const expiration = new Date(payload.exp * 1000);
			const now = new Date();

			if (now >= expiration) {
				localStorage.clear();
				navigate("/signin");
				window.location.reload();
				toast.error("Session expired, please log in again.");
			} else {
				// Set a timeout to remove the token just before it expires
				const timeout = expiration.getTime() - now.getTime();
				setTimeout(() => {
					localStorage.clear();
					navigate("/signin");
					window.location.reload();
					toast.error("Session expired, please log in again.");
				}, timeout);
			}
		}
	}, []);

	return (
		<div className={`sidebar ${isOpen ? "open" : ""}`}>
			<div className="logo-details flex items-center">
				<i className="bx bxs-book-open icon ml-2"></i>
				<div className="logo_name flex items-center mt-1">E-Library</div>
				<i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
			</div>
			<ul className="nav-list">
				<li>
					<button
						onClick={() => {
							navigate("/");
							setIsOpen(false);
						}}
					>
						<i className="bx bx-home"></i>
						<span className="links_name">Home</span>
					</button>
					<span className="tooltip">Home</span>
				</li>
				<li>
					<button
						onClick={() => {
							navigate(`/dashboard/${user.id}`);
							setIsOpen(false);
						}}
					>
						<i className="bx bx-grid-alt"></i>
						<span className="links_name">Dashboard</span>
					</button>
					<span className="tooltip">Dashboard</span>
				</li>
				<li>
					<button
						onClick={() => {
							navigate("/leaderboard");
							setIsOpen(false);
						}}
					>
						<i className="bx bx-bar-chart-alt-2"></i>
						<span className="links_name">Leaderboard</span>
					</button>
					<span className="tooltip">Leaderboard</span>
				</li>
				<li>
					<button
						onClick={() => {
							navigate("/postFile");
							setIsOpen(false);
						}}
					>
						<i className="bx bx-comment-dots"></i>
						<span className="links_name">PostFile</span>
					</button>
					<span className="tooltip">PostFile</span>
				</li>
				{/* <li className="relative">
          <button onClick={togglePopup}>
            <i className="bx bx-chat"></i>
            <span className="links_name">ChatRoom</span>
          </button>
          <span className="tooltip">ChatRoom</span>

          {isPopupOpen && (
            <div className="popup fixed inset-0 flex items-center justify-center z-50">
              <div className="popup-content bg-gray-800 text-white p-5 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Select Option</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      navigate("/chat/all");
                      setIsOpen(false);
                      togglePopup();
                    }}
                    className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      navigate(/chat/${user.branch});
                      setIsOpen(false);
                      togglePopup();
                    }}
                    className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
                  >
                    {user.branch}
                  </button>
                  <button
                    onClick={() => {
                      navigate(/chat/${user.batch});
                      setIsOpen(false);
                      togglePopup();
                    }}
                    className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
                  >
                    {user.batch}
                  </button>
                </div>
                <button
                  onClick={togglePopup}
                  className="mt-4 bg-red-600 hover:bg-red-500 py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </li>
        <li>
          <button
            onClick={() => {
              navigate("/doubts");
              setIsOpen(false);
            }}
          >
            <i className="bx bx-file"></i>
            <span className="links_name">Doubts</span>
          </button>
          <span className="tooltip">Doubts</span>
        </li>
        <li>
          <button
            onClick={() => {
              navigate("/postDoubt");
              setIsOpen(false);
            }}
          >
            <i className="bx bx-comment-dots"></i>
            <span className="links_name">PostDoubt</span>
          </button>
          <span className="tooltip">PostDoubt</span>
        </li>
        <li>
          <button
            onClick={() => {
              navigate("/reguser");
              setIsOpen(false);
            }}
          >
            <i className="bx bx-user"></i>
            <span className="links_name">Users</span>
          </button>
          <span className="tooltip">Users</span>
        </li> */}
				<li className="profile w-full">
					<div className="profile-details">
						<div className="flex items-center mb-4">
							<div className="h-11 w-11 rounded-md mr-2 flex items-center justify-center bg-black text-white text-xl font-bold shadow-glow">
								{user.name.charAt(0)}
							</div>
						</div>

						<div className="name_job flex-1">
							<div className="name ml-2  mt-2 truncate">{user.name}</div>
						</div>
					</div>
					<button
						onClick={() => {
							localStorage.clear();
							navigate("/signin");
						}}
						className="logout-btn"
					>
						<i className="bx bx-log-out" id="log_out"></i>
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
