import { useState } from "react";
import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from "react-i18next";
import { useThemeMode } from "../theme/theme-context";
import { setLanguage } from "../i18n";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function Header() {
  const { mode, toggleMode } = useThemeMode();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const langOpen = Boolean(langAnchorEl);

  function handleMenuOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleLangOpen(event: MouseEvent<HTMLElement>) {
    setLangAnchorEl(event.currentTarget);
  }

  function handleLangClose() {
    setLangAnchorEl(null);
  }

  return (
    <AppBar position="static" color="secondary">
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
        <Link to="/" aria-label="ATPLKing">
          <Box
            component="img"
            src="/images/logo.png"
            alt="ATPLKing"
            sx={{ height: 48, display: "flex", alignItems: "center" }}
          />
        </Link>

        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <IconButton
            color="inherit"
            aria-label={t("header.menu")}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={handleMenuOpen}
            sx={{ borderRadius: 1.5 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/dashboard");
              }}
            >
              <SpaceDashboardIcon sx={{ mr: 1, fontSize: 20 }} />
              {t("header.dashboard")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/historic");
              }}
            >
              <HistoryIcon sx={{ mr: 1, fontSize: 20 }} />
              {t("header.history")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/admin");
              }}
            >
              <LibraryBooksIcon sx={{ mr: 1, fontSize: 20 }} />
              {t("header.admin")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/setting");
              }}
            >
              <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
              {t("header.settings")}
            </MenuItem>
          </Menu>

          <IconButton
            color="inherit"
            aria-label={t("header.language")}
            aria-haspopup="true"
            aria-expanded={langOpen}
            onClick={handleLangOpen}
            sx={{ borderRadius: "50%" }}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={langOpen}
            onClose={handleLangClose}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem
                key={lang.code}
                selected={i18n.language === lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  handleLangClose();
                }}
              >
                {i18n.language === lang.code && (
                  <CheckIcon sx={{ mr: 1, fontSize: 20 }} />
                )}
                {lang.label}
              </MenuItem>
            ))}
          </Menu>

          <IconButton
            color="inherit"
            aria-label={t("header.toggleTheme")}
            onClick={toggleMode}
            sx={{ borderRadius: "50%" }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            color="inherit"
            aria-label={t("header.github")}
            component="a"
            href="https://github.com/ATPLKing/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ borderRadius: "50%" }}
          >
            <GitHubIcon />
          </IconButton>

          <Button
            component="a"
            href="https://buymeacoffee.com/chesterkxng"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<FavoriteIcon />}
            sx={{
              borderRadius: 25,
              textTransform: "none",
              bgcolor: "#1976d2",
              px: 2,
              whiteSpace: "nowrap",
            }}
          >
            {t("header.buyCoffee")}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
