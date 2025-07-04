// Simple test to verify Logtail logging is working
const { Logtail } = require("@logtail/browser");

// Test the Logtail configuration
const logtail = new Logtail("gDcpojWzsEzzJVpXTyjAFsPF", {
  endpoint: 'https://in.logs.betterstack.com',
});

console.log("Testing Logtail logging...");

// Send a test log
logtail.info("Test log from Partners Competition App", {
  test: true,
  timestamp: new Date().toISOString(),
  environment: "test"
});

console.log("Test log sent to Logtail");

// Flush the logs
logtail.flush().then(() => {
  console.log("Logs flushed successfully");
}).catch((error) => {
  console.error("Error flushing logs:", error);
});
