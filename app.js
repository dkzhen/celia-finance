const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const readline = require("readline");
dotenv.config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function loginToCelia() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  }); // Launch the browser
  const page = await browser.newPage(); // Create a new page
  let email = null;

  // Prompt for the email
  while (!email) {
    email = await askQuestion("Enter your email:");

    // Wait for a short duration to allow time for input
    await page.waitForTimeout(1000);
  }
  // Navigate to the Celia Finance login page
  await page.goto("https://celia.finance/login");
  await page.waitForSelector('input[name="email"]');

  // Fill in the login form
  await page.type('input[name="email"]', email); // Replace with your email address
  await page.type('input[name="current-password"]', process.env.PASSWORD); // Replace with your password

  // Click the login button
  await page.click('button[type="submit"]');

  // Wait for the login process to complete
  await page.waitForNavigation();

  // Perform actions on the dashboard after logging in
  // Example: Access dashboard elements, perform tasks, etc.
  await page.waitForSelector('a[href="/mine"]');

  // Click the link
  await page.click('a[href="/mine"]');
  await page.waitForTimeout(5000); // 2 seconds

  await page.waitForSelector("button#mine-button.circular-button");

  // Click the button
  await page.click("button#mine-button.circular-button");
  await page.waitForTimeout(5000);

  // Click the button
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");

  console.log("mining successfully login again tomorrow...");
  // Close the browser
  await browser.close();

  // Schedule the login process to run every 24 hours
}
// const interval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
// setInterval(loginToCelia, interval);

// Call the login function
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Call the login function
loginToCelia().then(() => {
  rl.close();
});
