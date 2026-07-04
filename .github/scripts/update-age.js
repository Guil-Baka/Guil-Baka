const fs = require("fs");

const README_PATH = "README.md";
const BIRTH_DATE = "2000-05-08";
const EGG_START = "<!-- birthday-egg:start -->";
const EGG_END = "<!-- birthday-egg:end -->";

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

function isBirthdayToday(birthDateString) {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  return (
    today.getUTCMonth() === birthDate.getUTCMonth() &&
    today.getUTCDate() === birthDate.getUTCDate()
  );
}

function upsertBirthdayEasterEgg(readme, shouldShow) {
  const eggBlock = `${EGG_START}\n> 🎂 **It is my birthday today!** Thanks for stopping by.\n${EGG_END}\n\n`;

  const existingEggPattern = new RegExp(
    `${EGG_START}[\\s\\S]*?${EGG_END}\\n?\\n?`,
    "g"
  );

  const withoutEgg = readme.replace(existingEggPattern, "");

  if (!shouldShow) return withoutEgg;

  // Keep the Easter egg near the top for visibility.
  if (withoutEgg.startsWith("# ")) {
    const firstNewline = withoutEgg.indexOf("\n");
    if (firstNewline !== -1) {
      return (
        withoutEgg.slice(0, firstNewline + 1) +
        "\n" +
        eggBlock +
        withoutEgg.slice(firstNewline + 1)
      );
    }
  }

  return eggBlock + withoutEgg;
}

function updateReadmeAge() {
  const age = calculateAge(BIRTH_DATE);
  const showBirthdayEgg = isBirthdayToday(BIRTH_DATE);
  const readme = fs.readFileSync(README_PATH, "utf8");

  // Safer: only update the "age" property in the "const guilherme = { ... }" block
  // and keep it as a quoted string in README.
  const withUpdatedAge = readme.replace(
    /(const\s+guilherme\s*=\s*\{[\s\S]*?\bage:\s*)(["'])\d+\2(\s*,[\s\S]*?\};)/,
    `$1"${age}"$3`
  );

  const updated = upsertBirthdayEasterEgg(withUpdatedAge, showBirthdayEgg);

  if (updated !== readme) {
    fs.writeFileSync(README_PATH, updated, "utf8");
    console.log(
      `README updated with age: ${age}${
        showBirthdayEgg ? " (birthday Easter egg enabled)" : ""
      }`
    );
  } else {
    console.log("No README changes needed.");
  }
}

updateReadmeAge();