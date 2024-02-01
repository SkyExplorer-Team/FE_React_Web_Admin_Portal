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
            <Route path="/dashboard" element={<AppLayout />} />
            <Route path="/account" element={<AppLayout />} />
            <Route path="/account/add" element={<AppLayout />} />
            <Route path="/account/update/:id" element={<AppLayout />} />
            <Route path="/airport" element={<AppLayout />} />
            <Route path="/airplane" element={<AppLayout />} />
            <Route path="/schedule" element={<AppLayout />} />
          </Route>
          <Route path="*" element={<PageNotFound/>} />
          <Route path="/not-found" element={<PageNotFound/>} />
        </Routes>
      </Router>
    </CheckConnection>
  );
};

export default App;
