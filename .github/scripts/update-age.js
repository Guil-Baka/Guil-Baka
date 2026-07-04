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

  // Safer: only update the "age" property in the "const guilherme = { ... }" block
  // and keep it as a quoted string in README.
  const updated = readme.replace(
    /(const\s+guilherme\s*=\s*\{[\s\S]*?\bage:\s*)(["'])\d+\2(\s*,[\s\S]*?\};)/,
    `$1"${age}"$3`
  );

  if (updated !== readme) {
    fs.writeFileSync(README_PATH, updated, "utf8");
    console.log(`README updated with age: ${age}`);
  } else {
    console.log("Could not find guilherme.age pattern. No changes made.");
  }
}

updateReadmeAge();