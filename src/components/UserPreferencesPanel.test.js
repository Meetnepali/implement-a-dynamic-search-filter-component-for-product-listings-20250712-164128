import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserPreferencesPanel from './UserPreferencesPanel';
import { ThemeProviderWrapper } from '../theme/ThemeContext';

const renderPanel = () =>
  render(
    <ThemeProviderWrapper>
      <UserPreferencesPanel userId="test_user" />
    </ThemeProviderWrapper>
  );

describe('UserPreferencesPanel', () => {
  test('loads and displays initial preferences', async () => {
    renderPanel();
    expect(screen.getByText(/Notification Settings/)).toBeInTheDocument();
    await screen.findByLabelText('Enable Email Notifications'); // waits for load
    expect(screen.getByLabelText('Enable Email Notifications').checked).toBe(true);
    expect(screen.getByLabelText('Enable Push Notifications').checked).toBe(false);
    expect(screen.getByLabelText('Switch between light and dark theme').checked).toBe(false);
  });

  test('shows validation if neither notification is enabled', async () => {
    renderPanel();
    await screen.findByLabelText('Enable Email Notifications');
    const emailSwitch = screen.getByLabelText('Enable Email Notifications');
    const pushSwitch = screen.getByLabelText('Enable Push Notifications');
    fireEvent.click(emailSwitch);
    fireEvent.click(pushSwitch); // both off
    await waitFor(() => {
      expect(screen.getByText(/Enable at least one notification/)).toBeInTheDocument();
    });
  });

  test('saving and error feedback appears', async () => {
    renderPanel();
    await screen.findByLabelText('Enable Email Notifications');
    const pushSwitch = screen.getByLabelText('Enable Push Notifications');
    fireEvent.click(pushSwitch); // on
    await waitFor(() => expect(screen.getByText(/Saving/)).toBeInTheDocument());
    // Either success or (simulated) error eventually
    await waitFor(
      () =>
        expect(
          screen.getByText(/Preferences saved!|Simulated server error saving preferences/)
        ).toBeInTheDocument(),
      { timeout: 2000 }
    );
  });

  test('theme switch updates instantly and persists', async () => {
    renderPanel();
    await screen.findByLabelText('Switch between light and dark theme');
    const themeSwitch = screen.getByLabelText('Switch between light and dark theme');
    expect(themeSwitch.checked).toBe(false); // light mode
    fireEvent.click(themeSwitch);
    expect(themeSwitch.checked).toBe(true); // now dark
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
