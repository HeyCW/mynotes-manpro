import './App.css';
import SetupRoutes from './routes/SetupRoutes';
import { AuthProvider } from './Auth/AuthContext';

const App = () => {
      return( 
      <AuthProvider>
            <SetupRoutes />
      </AuthProvider>
      
)}

export default App;
