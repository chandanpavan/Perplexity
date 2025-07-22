// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the app pages (make sure they exist in /pages/)
import Home from './Pages/Home';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Register from './Pages/Register';
import Tournaments from './Pages/Tournaments';
import Admin from './Pages/Admin';
import Leaderboard from './Pages/Leaderboard';
import SubmitResult from './Pages/SubmitResult';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import Payment from './Pages/Payment';
import AddFriend from './Pages/AddFriend';
import FriendRequests from './Pages/FriendRequests';
import FriendList from './Pages/FriendList';
import CreateSquad from './Pages/CreateSquad';
import SquadRequests from './Pages/SquadRequests';
import SquadPage from './Pages/SquadPage'
import MatchXPHistory from './Pages/MatchXPHistory';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />           {/* Homepage */}
        <Route path="/login" element={<Login />} />     {/* Login Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/results" element={<SubmitResult />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/friends/add" element={<AddFriend />} />
        <Route path="/friends/requests" element={<FriendRequests />} />
        <Route path="/friends/list" element={<FriendList />} />
        <Route path="/squad" element={<SquadPage />} />
        <Route path="/squad/create" element={<CreateSquad />} />
        <Route path="/squad/requests" element={<SquadRequests />} />
        <Route path="/xp-history" element={<MatchXPHistory />} />


      </Routes>
    </Router>
  );
}

export default App;
