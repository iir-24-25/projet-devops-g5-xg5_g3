import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizApp from './component/QuizApp'; // Import my component
import CategoryApp from './component/CategoryApp'; // Import my component
import QuestionCRUD from './component/QuestionCRUD';
import Accueil from './component/Accueil.js';
import Quiz from './component/Quiz.js';
import QuizCRUD from './component/QuizCRUD.js'; // Import my component
import Login from './component/Login.js';
import Register from './component/Register.js';
import Dashboard from './component/Dashboard.js';
import Settings from './component/Settings.js';
import CreateQuestion from './component/CreateQuestion.js';

import MonProfil from './component/MonProfil.js';
import MesQuizs from './component/MesQuizs.js';

import LoginAdmin from './component/LoginAdmin.js';
import ProtectedAdminRoute from './component/ProtectedAdminRoute.js';

import Logout from './component/Logout.js';
import UserList from './component/UserList.js';
import QuizResultsTable from './component/QuizResultsTable.js';







 // Import my component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-quiz" element={<QuizApp />} />

        <Route path="/" element={<Accueil />} />
        <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/qt" element={<CreateQuestion />} />
        
        <Route path="/Result" element={<QuizResultsTable />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofil" element={<MonProfil />} />
        <Route path="/mesquiz" element={<MesQuizs />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
              
            </ProtectedAdminRoute>
          }
        />  
        <Route
          path="/Quiz"
          element={
            <ProtectedAdminRoute>
              <QuizCRUD />
              
            </ProtectedAdminRoute>
          }
        />      
        <Route
          path="/Questions"
          element={
            <ProtectedAdminRoute>
              <QuestionCRUD />
              
            </ProtectedAdminRoute>
          }
        /> 
        <Route
          path="/categories"
          element={
            <ProtectedAdminRoute>
              <CategoryApp />
              
            </ProtectedAdminRoute>
          }
        /> 
        <Route
          path="/userlist"
          element={
            <ProtectedAdminRoute>
              <UserList />
              
            </ProtectedAdminRoute>
          }
        />    
        <Route
          path="/Settings"
          element={
            <ProtectedAdminRoute>
              <Settings />
              
            </ProtectedAdminRoute>
          }
        />        
      </Routes>
    </Router>
  );
}

export default App;