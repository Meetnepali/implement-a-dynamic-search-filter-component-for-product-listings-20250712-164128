// Simulated API with artificial latency and error
export function saveUserPreferences(userId, preferences) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly fail 20% of the time
      if (Math.random() < 0.2) {
        reject({ message: "Simulated server error saving preferences." });
      } else {
        resolve({ status: 200, data: preferences });
      }
    }, 1000); // 1 second artificial delay
  });
}
// Get initial user preferences
export function getUserPreferences(userId) {
  // Simulated default values
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        emailNotifications: true,
        pushNotifications: false,
        theme: "light"
      });
    }, 600);
  });
}
