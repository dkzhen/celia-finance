const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const dotenv = require("dotenv");
const readline = require("readline");
dotenv.config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function loginToCelia() {
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  let email = null;

  while (!email) {
    email = await askQuestion("Enter your email:");
    await page.waitForTimeout(1000);
  }

  await page.goto("https://celia.finance/login");
  await page.waitForSelector('input[name="email"]');

  await page.type('input[name="email"]', email);
  await page.type('input[name="current-password"]', process.env.PASSWORD);

  await page.click('button[type="submit"]');
  console.log("Login success / not verified...");

  await page.waitForNavigation();

  await page.waitForSelector('a[href="/mine"]');
  await page.click('a[href="/mine"]');
  await page.waitForTimeout(5000);

  await page.waitForSelector("button#mine-button.circular-button");
  await page.click("button#mine-button.circular-button");
  await page.waitForTimeout(5000);

  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");

  console.log("Mining successfully. Log in again tomorrow...");

  // Close the browser
  await browser.close();
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

loginToCelia().then(() => {
  rl.close();
});
