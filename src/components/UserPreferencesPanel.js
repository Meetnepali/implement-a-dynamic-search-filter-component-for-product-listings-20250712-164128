import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { saveUserPreferences, getUserPreferences } from "../api/preferencesApi";
import useDebouncedCallback from "../hooks/useDebouncedCallback";
import { useThemeMode } from "../theme/ThemeContext";

function validatePreferences(state) {
  // At least one notification method must be enabled
  if (!state.emailNotifications && !state.pushNotifications) {
    return "Enable at least one notification method (email or push).";
  }
  // Theme required (simulate rule)
  if (!state.theme) return "Theme is required.";
  return null;
}

export default function UserPreferencesPanel({ userId }) {
  const { mode, setTheme } = useThemeMode();
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    pushNotifications: false,
    theme: "light"
  });
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState({ status: "idle", error: null });
  const [validationError, setValidationError] = useState("");

  // On mount, load initial preferences
  useEffect(() => {
    setLoading(true);
    getUserPreferences(userId).then(initialPrefs => {
      setPreferences(initialPrefs);
      setTheme(initialPrefs.theme);
      setLoading(false);
    });
  }, [userId, setTheme]);

  // Debounced Save
  const debouncedSave = useDebouncedCallback((nextPrefs) => {
    setSaveState({ status: "saving", error: null });
    saveUserPreferences(userId, nextPrefs)
      .then(() => {
        setSaveState({ status: "success", error: null });
        setTimeout(() => setSaveState({ status: "idle", error: null }), 1200);
      })
      .catch((err) => {
        setSaveState({ status: "error", error: err.message || "Unknown error" });
      });
  }, 750);

  // On change, validate and save
  useEffect(() => {
    if (!loading) {
      const error = validatePreferences(preferences);
      setValidationError(error);
      if (!error) {
        debouncedSave(preferences);
      }
    }
    // intentionally omit debouncedSave from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, loading, userId]);

  // Theme selection handler
  const handleThemeChange = (event) => {
    const newTheme = event.target.checked ? "dark" : "light";
    setPreferences(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleNotifChange = (event) => {
    const { name, checked } = event.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  // Form is "controlled"
  return (
    <Paper sx={{ p: 3 }} component="form" aria-label="User Preferences Panel">
      <Typography variant="h6" component="h2" gutterBottom>
        Notification Settings
      </Typography>
      <Box mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.emailNotifications}
              onChange={handleNotifChange}
              name="emailNotifications"
              color="primary"
              inputProps={{ 'aria-label': 'Enable Email Notifications'}}
            />
          }
          label="Email Notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={preferences.pushNotifications}
              onChange={handleNotifChange}
              name="pushNotifications"
              color="primary"
              inputProps={{ 'aria-label': 'Enable Push Notifications'}}
            />
          }
          label="Push Notifications"
        />
      </Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Display Theme
      </Typography>
      <Box mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.theme === "dark"}
              onChange={handleThemeChange}
              name="themeSwitcher"
              color="secondary"
              inputProps={{ 'aria-label': 'Switch between light and dark theme'}}
            />
          }
          label={preferences.theme === "dark" ? "Dark Theme" : "Light Theme"}
        />
      </Box>
      {/* Feedbacks */}
      {validationError && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>{validationError}</Alert>
      )}
      {saveState.status === "saving" && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CircularProgress size={18} />
          <Typography sx={{ ml: 1 }} component="span" aria-live="polite">Saving...</Typography>
        </Box>
      )}
      {saveState.status === "success" && (
        <Alert severity="success" role="status" sx={{ mb: 2 }}>Preferences saved!</Alert>
      )}
      {saveState.status === "error" && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>{saveState.error}</Alert>
      )}
      <Box mt={3}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            const error = validatePreferences(preferences);
            setValidationError(error);
            if (!error) {
              setSaveState({ status: "saving", error: null });
              saveUserPreferences(userId, preferences)
                .then(() => {
                  setSaveState({ status: "success", error: null });
                  setTimeout(() => setSaveState({ status: "idle", error: null }), 1200);
                })
                .catch((err) => {
                  setSaveState({ status: "error", error: err.message || "Unknown error" });
                });
            }
          }}
          aria-label="Manually save preferences"
        >
          Save Now
        </Button>
      </Box>
    </Paper>
  );
}

UserPreferencesPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};
