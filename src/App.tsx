import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider } from "./theme/ThemeContext";
import { useThemeMode } from "./theme/theme-context";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import HistoricPage from "./pages/HistoricPage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";

function AppContent() {
  const { theme } = useThemeMode();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/historic" element={<HistoricPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
