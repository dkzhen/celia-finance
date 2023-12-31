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
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  let email = null;
  let verificationCode = null;

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

  await page.waitForSelector('input[name="fullname"]');

  // Prompt for the verification code
  while (!verificationCode) {
    verificationCode = await askQuestion("Enter the verification code:");

    // Wait for a short duration to allow time for input
    await page.waitForTimeout(1000);
  }
  const number = verificationCode;
  console.log(number);

  const digit1 = Math.floor(number / 1000); // Extract the thousands digit
  const digit2 = Math.floor((number % 1000) / 100); // Extract the hundreds digit
  const digit3 = Math.floor((number % 100) / 10); // Extract the tens digit
  const digit4 = number % 10; // Extract the ones digit

  const countries = [
    "af",
    "ax",
    "al",
    "dz",
    "as",
    "ad",
    "ao",
    "ai",
    "aq",
    "ag",
    "ar",
    "am",
    "aw",
    "au",
    "at",
    "az",
    "bs",
    "bh",
    "bd",
    "bb",
    "by",
    "be",
    "bz",
    "bj",
    "bm",
    "bt",
    "bo",
    "bq",
    "ba",
    "bw",
    "bv",
    "br",
    "io",
    "bn",
    "bg",
    "bf",
    "bi",
    "kh",
    "cm",
    "ca",
    "cv",
    "ky",
    "cf",
    "td",
    "cl",
    "cn",
    "cx",
    "cc",
    "co",
    "km",
    "cg",
    "cd",
    "ck",
    "cr",
    "ci",
    "hr",
    "cu",
    "cw",
    "cy",
    "cz",
    "dk",
    "dj",
    "dm",
    "do",
    "ec",
    "eg",
    "sv",
    "gq",
    "er",
    "ee",
    "et",
    "fk",
    "fo",
    "fj",
    "fi",
    "fr",
    "gf",
    "pf",
    "tf",
    "ga",
    "gm",
    "ge",
    "de",
    "gh",
    "gi",
    "gr",
    "gl",
    "gd",
    "gp",
    "gu",
    "gt",
    "gg",
    "gn",
    "gw",
    "gy",
    "ht",
    "hm",
    "va",
    "hn",
    "hk",
    "hu",
    "is",
    "in",
    "id",
    "ir",
    "iq",
    "ie",
    "im",
    "tl",
    "it",
    "jm",
    "jp",
    "je",
    "jo",
    "kz",
    "ke",
    "ki",
    "kp",
    "kr",
    "kw",
    "kg",
    "la",
    "lv",
    "lb",
    "ls",
    "lr",
    "ly",
    "li",
    "lt",
    "lu",
    "mo",
    "mk",
    "mg",
    "mw",
    "my",
    "mv",
    "ml",
    "mt",
    "mh",
    "mq",
    "mr",
    "mu",
    "yt",
    "mx",
    "fm",
    "md",
    "mc",
    "mn",
    "me",
    "ms",
    "ma",
    "mz",
    "mm",
    "na",
    "nr",
    "np",
    "nl",
    "nc",
    "nz",
    "ni",
    "ne",
  ];

  const randomCountryIndex = Math.floor(Math.random() * countries.length);
  const randomCountry = countries[randomCountryIndex];

  const firstNames = [
    "John",
    "Jane",
    "David",
    "Emily",
    "Michael",
    "Olivia",
    "Sophia",
    "Daniel",
    "Emma",
    "Benjamin",
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Wilson",
    "Anderson",
  ];

  const randomFirstNameIndex = Math.floor(Math.random() * firstNames.length);

  const randomFirstName = firstNames[randomFirstNameIndex];

  const randomFullName = `${randomFirstName}`;
  // Fill in the verification code
  await page.type('input[name="fullname"]', randomFullName);
  await page.waitForTimeout(5000);
  const selectElement = await page.$("#inputGroupSelect01");

  // Selecting an option by its value
  await page.select("#inputGroupSelect01", randomCountry);
  await page.waitForTimeout(5000);
  await page.type('input[name="field1"]', digit1.toString());
  await page.waitForTimeout(5000);
  await page.type('input[name="field2"]', digit2.toString());
  await page.waitForTimeout(5000);
  await page.type('input[name="field3"]', digit3.toString());
  await page.waitForTimeout(5000);
  await page.type('input[name="field4"]', digit4.toString());
  await page.waitForTimeout(5000);
  // Click the submit button
  await page.click('button[name="verifysignup"]');
  await page.waitForNavigation();

  console.log("verification success....");
  // Wait for the verification process to complete

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

// Call the login function
loginToCelia().then(() => {
  rl.close();
});
