import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin'; // Ajuste le chemin selon ta structure

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  //const { pathname } = useLocation();

  // const isActive = (path) => {
  //   return pathname === path;
  // };

  const fetchData = async () => {
    try {
      const resUsers = await axios.get('http://localhost:9090/api/users');
      const users = resUsers.data;
      setUserCount(users.length);

      // Utilisateurs actifs (dans les 7 derniers jours)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const active = users.filter(user => new Date(user.lastLogin) > oneWeekAgo).length;
      setActiveUsers(active);

      // Nombre total de quiz
      const resQuizzes = await axios.get('http://localhost:9090/api/quizzes/count');
      setQuizCount(resQuizzes.data);

      // Inscriptions par mois
      const currentYear = new Date().getFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const registrationsByMonth = {};

      users.forEach(user => {
        const date = new Date(user.createdAt);
        const key = `${date.toLocaleString('default', { month: 'short' })} ${currentYear}`;
        registrationsByMonth[key] = (registrationsByMonth[key] || 0) + 1;
      });

      const formattedData = months.map(month => registrationsByMonth[`${month} ${currentYear}`] || 0);
      setMonthlyRegistrations(formattedData);

      // Derniers utilisateurs inscrits
      const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentUsers(sortedUsers.slice(0, 5));

    } catch (err) {
      console.error('Erreur lors du chargement des données', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Charger l'utilisateur connecté ou rediriger s'il n'est pas authentifié
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // Redirection si non connecté
        window.location.href = '/admin/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const avatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png ";

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
                        <div className="app-title">Quiz App</div>
                        <div className="nav-menu">
                          <Link to="/dashboard" className="nav-item active">Dashboard</Link>
                
                          {/* Menu déroulant Quiz */}
                          <div className="nav-item-dropdown">
                            <span className="nav-item ">Quiz</span>
                            <div className="dropdown-content">
                              <Link to="/quiz" className="dropdown-item">Quiz Liste</Link>
                              <Link to="/create-quiz" className="dropdown-item">create a quiz</Link>
                            </div>
                          </div>
                
                          <Link to="/questions" className="nav-item">Questions</Link>
                
                         <div className="nav-item-dropdown">
                            <span className="nav-item ">Users</span>
                            <div className="dropdown-content">
                              <Link to="/userlist" className="dropdown-item">Users List</Link>
                              <Link to="/result" className="dropdown-item">Users resultats</Link>
                            </div>
                          </div>          
                          <Link to="/categories" className="nav-item">Categorie</Link>
                          <Link to="/settings" className="nav-item">Settings</Link>
                        </div>
                      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Dashboard</h2>

        <div className="topbar">
          {currentUser && (
            <>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <div className="user-info">
                <span>{currentUser.displayName || currentUser.email}</span>
                <div className="user-avatar"></div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-content">
          <Link to="/create-quiz"><button className="create-btn">Create a Quiz</button></Link>

          {/* Stat Cards */}
          <div className="cards">
            <div className="dashboard-card" style={{ backgroundColor: '#ff5e5e' }}>
              <h4>Number of Quiz</h4>
              <h2>{quizCount}</h2>
            </div>
            <div className="dashboard-card" style={{ backgroundColor: '#f5c02e' }}>
              <h4>Number of Users</h4>
              <h2>{userCount}</h2>
            </div>
            <div className="dashboard-card" style={{ backgroundColor: '#2299f8' }}>
              <h4>Active Users (7 days)</h4>
              <h2>{activeUsers}</h2>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-section">
            {/* Recent Users */}
            <div className="last-passed">
              <h3>Last Registered Users</h3>
              <ul>
                {recentUsers.map((user, index) => (
                  <li key={index}>
                    <img src={avatarUrl} alt="Avatar" className="user-avatar-img" />
                    <div>
                      <strong>{user.username}</strong>
                      <p>{user.email}</p>
                    </div>
                    <span className="view-icon">👁️</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chart Section */}
            <div className="chart">
              <h3>User Registrations</h3>
              <div className="bar-chart">
                {monthlyRegistrations.map((value, index) => (
                  <div
                    key={index}
                    className="bar"
                    style={{ height: `${Math.max(value * 10, 10)}px` }}
                    title={`${value} inscrits`}
                  ></div>
                ))}
              </div>
              <div className="months">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;