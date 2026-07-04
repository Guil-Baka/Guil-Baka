const fs = require("fs");

const README_PATH = "README.md";
const BIRTH_DATE = "2000-05-08";

function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

  const hasHadBirthdayThisYear =
    today.getUTCMonth() > birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() &&
      today.getUTCDate() >= birthDate.getUTCDate());

  if (!hasHadBirthdayThisYear) age--;

  return age;
}

function updateReadmeAge() {
  const age = calculateAge(BIRTH_DATE);
  const readme = fs.readFileSync(README_PATH, "utf8");

  const updated = readme.replace(
    /<!--AGE_START-->.*?<!--AGE_END-->/s,
    `<!--AGE_START-->${age}<!--AGE_END-->`
  );

  if (updated !== readme) {
    fs.writeFileSync(README_PATH, updated, "utf8");
    console.log(`README updated with age: ${age}`);
  } else {
    console.log("No changes needed.");
  }
}

updateReadmeAge();