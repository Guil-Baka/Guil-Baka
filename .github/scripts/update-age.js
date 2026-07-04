const fs = require("fs");

const README_PATH = "README.md";
const BIRTH_DATE = "2008-05-08";

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

  // Safer: only update the "age" property in the "const guilherme = { ... }" block
  const updated = readme.replace(
    /(const\s+guilherme\s*=\s*\{[\s\S]*?\bage:\s*)\d+(\s*,[\s\S]*?\};)/,
    `$1${age}$2`
  );

  if (updated !== readme) {
    fs.writeFileSync(README_PATH, updated, "utf8");
    console.log(`README updated with age: ${age}`);
  } else {
    console.log("Could not find guilherme.age pattern. No changes made.");
  }
}

updateReadmeAge();