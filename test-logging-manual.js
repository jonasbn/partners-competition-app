// Test script to verify logging functionality in the React app
// This can be run in the browser console to test logging

// Simulate various user actions that should trigger logging
console.log("=== Testing Logger Functionality ===");

// Test basic logging (if Logger is available in window scope)
if (typeof window !== 'undefined' && window.Logger) {
  console.log("Logger available, testing...");
  
  // Test info log
  window.Logger.info("Test info message", { test: true });
  
  // Test user action
  window.Logger.userAction("test_action", { button: "test_button" });
  
  // Test performance metric
  window.Logger.performance("page_load_time", 1234, { page: "home" });
  
  // Test event
  window.Logger.event("test_event", { data: "test_data" });
  
  console.log("All test logs sent to Logtail");
} else {
  console.log("Logger not available in window scope - this is expected in production builds");
}

// Instructions for manual testing
console.log(`
=== Manual Testing Instructions ===
1. Toggle theme (dark/light mode) - should log theme changes
2. Change language (English/Danish) - should log language changes  
3. Hover over player avatars - should log avatar interactions
4. Click on different sections - should log user actions
5. Check browser console for log messages
6. Logs are sent to Logtail with token: gDcpojWzsEzzJVpXTyjAFsPF
`);
