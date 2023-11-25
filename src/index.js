import "dotenv/config";

const now = new Date();
const christmas = new Date(`December 24, ${now.getFullYear()} 00:00:00`);

function formatTimeUntil(timeUntil) {
  const totalSeconds = Math.floor((timeUntil.getTime() - Date.now()) / 1000);
  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = Math.floor(totalSeconds) % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function getAdventSundays() {
  const now = new Date();
  const year = now.getFullYear();

  const sevenDays = 24 * 60 * 60 * 1000 * 7;
  const fourthAdventSunday = findLastAdventSunday(new Date(year, 11, 23));
  const thirdAdventSunday = new Date(fourthAdventSunday.getTime() - sevenDays);
  const secondAdventSunday = new Date(thirdAdventSunday.getTime() - sevenDays);
  const firstAdventSunday = new Date(secondAdventSunday.getTime() - sevenDays);

  return [
    firstAdventSunday,
    secondAdventSunday,
    thirdAdventSunday,
    fourthAdventSunday,
  ];
}

function findLastAdventSunday(date) {
  if (date.getDay() === 1) {
    return date;
  }

  return findLastAdventSunday(
    new Date(now.getFullYear(), 11, date.getDate() - 1)
  );
}

{
  const { days, hours, minutes } = formatTimeUntil(christmas);
  const sundays = getAdventSundays();

  await fetch(process.env.WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: [
        `🎄 With **${days}** days, **${hours}** hours, and **${minutes}** minutes left, Christmas is just around the corner! 🎅`,
        ``,
        sundays.length !== 0
          ? `🕯️ The remaining Advent Sundays are:\n- ${sundays
              .filter((sunday) => sunday.getTime() >= Date.now())
              .map((s) => `<t:${Math.floor(s.getTime() / 1000)}:d>`)
              .join("\n- ")}`
          : `🕯️ All the Advent Sundays have passed, and we're in the final stretch.\nLet's spread the holiday cheer and look forward to the joy and warmth that Christmas brings! 🌟`,
      ].join("\n"),
    }),
  });
}
