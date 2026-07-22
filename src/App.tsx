import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import HomePage from "./pages/HomePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import SupportPage from "./pages/SupportPage";

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="privacy" element={<PrivacyPolicyPage />} />
      <Route path="terms" element={<TermsOfServicePage />} />
      <Route path="support" element={<SupportPage />} />
      <Route path="*" element={<HomePage />} />
    </Route>
  </Routes>
);

export default App;
