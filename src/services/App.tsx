import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CreateNewPass from "./pages/CreateNewPass";
import AppLayout from "./layout/DefaultLayout";
import PublicRoutes from "./utils/PublicRoutes";
import PrivateRoutes from "./utils/PrivateRoutes";
import CheckEmail from "./pages/CheckEmail";
import PageNotFound from "./pages/NotFound";
import CheckConnection from "../components/CheckConnection";
import MainComponent from "../components/MainDashboard";
import ManageAccount from "./pages/ManageAccount";
import AddAccount from "./pages/AddAcount";
import EditAccount from "./pages/EditAccount";

const App: React.FC = () => {
  return (
    <CheckConnection>
      <Router>
        <Routes>
          <Route element={<PublicRoutes />} >
            <Route path="/" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password/:token" element={<CreateNewPass />} />
            <Route path="/check-email" element={<CheckEmail />} />
          </Route>
          <Route element={<PrivateRoutes />} >
            <Route path="/dashboard" element={<AppLayout contentComponent={<MainComponent/>}  />} />
            <Route path="/account" element={<AppLayout contentComponent={<ManageAccount/>}  />} />
            <Route path="/account/add" element={<AppLayout contentComponent={<AddAccount/>}  />} />
            <Route path="/account/update/:id" element={<AppLayout contentComponent={<EditAccount/>}  />} />
          </Route>
          <Route path="*" element={<PageNotFound/>} />
          <Route path="/not-found" element={<PageNotFound/>} />
        </Routes>
      </Router>
    </CheckConnection>
  );
};

export default App;
