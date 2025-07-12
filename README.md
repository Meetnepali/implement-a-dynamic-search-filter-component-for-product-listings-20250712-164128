# User Preferences Panel Assessment

## Task Description

You are provided with the foundation code for a User Preferences Panel in a SaaS dashboard application. Your task is to complete and enhance the `UserPreferencesPanel` React component so that users can:
- Toggle email and push notification preferences
- Switch between light and dark display themes (persisted in localStorage)
- Have their preferences auto-saved asynchronously to a mock REST API with debounced network calls
- Receive clear feedback on success, saving, or error states
- Validate that at least one notification method is chosen
- Experience real-time UI updates when changing theme
- Enjoy improved accessibility (proper ARIA labels, role attributes, semantic structure)

You must:
- Implement or enhance missing features, validation, and integration points as needed
- Make sure controlled form inputs, auto-save logic, feedback messages, theme context, and accessibility are functional and robust
- Ensure error and success states are handled gracefully
- Apply a modular code structure and use custom hooks where appropriate
- Document the component with PropTypes or TypeScript types
- Pass the included unit tests covering form logic and result states

## Setup Instructions

1. **Install dependencies:**
   - Run `npm install` or `yarn install` in the project directory.

2. **Start the application:**
   - Run `npm start` or `yarn start`. The app will be available at [http://localhost:3000](http://localhost:3000).

3. **Run tests:**
   - Run `npm test` or `yarn test` to run the provided unit tests.

## Verification

- Test all features via the UI to confirm correct validation, theme change, auto-saving, and feedback behaviors.
- Ensure accessibility features are present (using screen readers or browser dev tools).
- All unit tests in `src/components/UserPreferencesPanel.test.js` should pass.

---

Deliver a clean, functional, accessible preferences panel that auto-saves and persists user choices, providing clear feedback and passing tests.