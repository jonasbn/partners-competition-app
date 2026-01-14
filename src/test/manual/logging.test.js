/**
 * Manual Test: Logtail Integration Verification
 * 
 * Purpose: Test Logtail logging integration outside of the React app context
 * Usage: Run this script directly with Node.js to verify Logtail configuration
 * Command: node src/test/manual/logging.test.js
 * 
 * This test verifies:
 * - Logtail SDK initialization
 * - Log sending functionality
 * - Error handling and flush operations
 */

// Simple test to verify Logtail logging is working
import { Logtail } from "@logtail/browser";
import dotenv from "dotenv";
import path from "path";

// Load environment-specific file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// Test the Logtail configuration
const logtail = new Logtail(process.env.VITE_LOGTAIL_KEY || "", {
  endpoint: 'https://in.logs.betterstack.com',
});

console.log("Testing Logtail logging...");

// Send a test log
logtail.info("Test log from Partners Competition App: " + process.env.VITE_ECHO, {
  test: true,
  timestamp: new Date().toISOString(),
  environment: "test"
});

console.log("Test log sent to Logtail with value: " + process.env.VITE_ECHO);

// Flush the logs
logtail.flush().then(() => {
  console.log("Logs flushed successfully");
}).catch((error) => {
  console.error("Error flushing logs:", error);
});
