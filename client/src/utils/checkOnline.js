export function checkOnline(timeInMili, isChat) {
  const FIVE_MINUTES_IN_MILI = 300000;
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - timeInMili;

  if (timeDiff >= FIVE_MINUTES_IN_MILI) {
    return convertMsToMinutesSeconds(timeDiff);
  }

  if (isChat) return convertMsToMinutesSeconds(timeDiff);

  return "now";
}

function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.ceil(milliseconds / 60000).toFixed();
  const hours = (minutes / 60).toFixed();
  const days = (hours / 24).toFixed();

  if (minutes >= 60 && hours <= 24) return `${(minutes / 60).toFixed()}h`;
  if (hours >= 24 && days <= 7) return days + "d";
  if (days >= 7) {
    return "long time";
  }
  return `${minutes}m`;
}
