import { DateTime } from 'luxon';

export const formatDateWithTime = (date: string | undefined | null) => {
  if (!date) return null;
  const jsDate = new Date(date);
  // @ts-ignore
  if (jsDate == 'Invalid Date') return date; // date is already correct
  // rerurns date in this format '09/20/2023 13:54:49 -0400'
  const format = 'MM/dd/yyyy HH:mm:ss Z';
  const locale = 'en-US';
  return DateTime.fromJSDate(jsDate, { zone: 'America/New_York' }).toFormat('MM/dd/yyyy HH:mm:ss ZZZ');
};

// YYYYMMDD -> MM/DD/YYYY
export const formatItemDates = (date: string | undefined | null) => {
  if (!date) return '';
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  return `${month}/${day}/${year}`;
};

//  20230501 => 01/05/2023
export function yyyymmdd2UsDate(yyyymmdd: string | null | undefined): string {
  if (!yyyymmdd || yyyymmdd.length != 8 || Number.isNaN(Number(yyyymmdd))) return '';
  return `${yyyymmdd.substring(4, 6)}/${yyyymmdd.substring(6, 8)}/${yyyymmdd.substring(0, 4)}`;
}

// 1/5/2023 => 20230501
export function usDate2yyyymmdd(usDate: string | null | undefined): string | null {
  if (!usDate) return null;
  const tokens = usDate.split('/');
  if (tokens.length != 3) return null;

  function pad2(s: string): string {
    return s.length == 1 ? '0' + s : s;
  }
  return `${tokens[2]}${pad2(tokens[0])}${pad2(tokens[1])}`;
}

export function validateDate(dateStr: any = ''): string {
  const regExp = /^(\d\d?)\/(\d\d?)\/(\d{4})$/;
  let matches = dateStr.match(regExp);
  let isValid = matches;
  let maxDate = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (matches) {
    const month = parseInt(matches[1]);
    const date = parseInt(matches[2]);
    const year = parseInt(matches[3]);

    isValid = month <= 12 && month > 0;
    isValid = isValid && date <= maxDate[month] && date > 0;

    const leapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 != 0);
    isValid = isValid && (month !== 2 || leapYear || date <= 28);
  }
  return isValid;
}
// 08/06/2023 14:40:55 -0400
export function toIsoString(date: Date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num: number) {
      return (num < 10 ? '0' : '') + num;
    };

  return (
    pad(date.getDate()) +
    '/' +
    pad(date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    ' ' +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    pad(Math.abs(tzo) % 60)
  );
}
