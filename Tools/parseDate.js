export default function parseDate(date) {
  const minute = date.getMinutes();
  const hour = date.getHours();
  let minuteUp = '';
  let hourUp = '';

  if (parseInt(hour) < 10) hourUp = '0' + hour
  else hourUp = hour
  if (parseInt(minute) < 10) minuteUp = '0' + minute
  else minuteUp = minute

  return [hourUp + ':' + minuteUp, hourUp, minuteUp]
}