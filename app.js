const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();
async function loginToCelia() {
  const browser = await puppeteer.launch({ headless: false }); // Launch the browser
  const page = await browser.newPage(); // Create a new page

  // Navigate to the Celia Finance login page
  await page.goto("https://celia.finance/login");
  await page.waitForSelector('input[name="email"]');

  // Fill in the login form
  await page.type('input[name="email"]', process.env.EMAIL); // Replace with your email address
  await page.type('input[name="current-password"]', process.env.PASSWORD); // Replace with your password

  // Click the login button
  await page.click('button[type="submit"]');

  // Wait for the login process to complete
  await page.waitForNavigation();

  // Perform actions on the dashboard after logging in
  // Example: Access dashboard elements, perform tasks, etc.
  const linkSelector = 'a[href="/mine"][onclick^="location.href="]';

  // Click on the link
  await page.click(linkSelector);
  console.log("mining successfully waiting for tomorrow...");
  // Close the browser
  await browser.close();

  // Schedule the login process to run every 24 hours
}
const interval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setInterval(loginToCelia, interval);

// Call the login function
loginToCelia();