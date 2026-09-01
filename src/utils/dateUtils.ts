// Utility functions for converting numbers and formatting dates and times into Bengali
// Follows the official Bangladesh Bangla Academy Revised Bengali Calendar Standard

export const toBengaliDigits = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? bengaliDigits[parsed] : char;
    })
    .join('');
};

export const getBengaliDayName = (date: Date = new Date()): string => {
  const days = [
    'রবিবার',
    'সোমবার',
    'মঙ্গলবার',
    'বুধবার',
    'বৃহস্পতিবার',
    'শুক্রবার',
    'শনিবার',
  ];
  return days[date.getDay()];
};

export const getBengaliMonthName = (monthIndex: number): string => {
  const months = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];
  return months[monthIndex];
};

export const getFormattedEnglishDate = (date: Date = new Date()): string => {
  const day = toBengaliDigits(date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
  const month = getBengaliMonthName(date.getMonth());
  const year = toBengaliDigits(date.getFullYear());
  return `${day} ${month} ${year}`;
};

/**
 * 100% accurate Bengali Era (বঙ্গাব্দ) calculation
 * Based on the Revised Bengali Calendar adopted in Bangladesh (Bangla Academy 2019):
 * - Boishakh 1 is always April 14
 * - First 6 months (Boishakh to Ashwin) = 31 days each
 * - Next 5 months (Kartik to Falgun) = 30 days each (Falgun has 31 days in Gregorian leap year)
 * - Last month (Choitro) = 30 days
 */
export const getFormattedBengaliEraDate = (date: Date = new Date()): string => {
  const gregYear = date.getFullYear();
  // Reference date: April 14 00:00:00 local time of current year
  const startOfThisBanglaYear = new Date(gregYear, 3, 14, 0, 0, 0, 0);

  let banglaYear: number;
  let refStartDate: Date;
  let falgunYear: number;

  // Compare using midnight dates
  const dateZero = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

  if (dateZero.getTime() >= startOfThisBanglaYear.getTime()) {
    banglaYear = gregYear - 593;
    refStartDate = startOfThisBanglaYear;
    falgunYear = gregYear + 1;
  } else {
    banglaYear = gregYear - 594;
    refStartDate = new Date(gregYear - 1, 3, 14, 0, 0, 0, 0);
    falgunYear = gregYear;
  }

  // Days elapsed since April 14 (0-indexed: April 14 is day 0)
  const diffTime = dateZero.getTime() - refStartDate.getTime();
  let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isLeap = (falgunYear % 4 === 0 && falgunYear % 100 !== 0) || (falgunYear % 400 === 0);
  const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeap ? 31 : 30, 30];
  const monthNames = [
    'বৈশাখ',
    'জ্যৈষ্ঠ',
    'আষাঢ়',
    'শ্রাবণ',
    'ভাদ্র',
    'আশ্বিন',
    'কার্তিক',
    'অগ্রহায়ণ',
    'পৌষ',
    'মাঘ',
    'ফাল্গুন',
    'চৈত্র',
  ];

  let monthIndex = 0;
  while (monthIndex < 12 && diffDays >= monthDays[monthIndex]) {
    diffDays -= monthDays[monthIndex];
    monthIndex++;
  }

  if (monthIndex >= 12) {
    monthIndex = 11;
    diffDays = monthDays[11] - 1;
  }

  const banglaDay = diffDays + 1;
  const banglaMonth = monthNames[monthIndex];

  return `${toBengaliDigits(banglaDay)} ${banglaMonth} ${toBengaliDigits(banglaYear)} বঙ্গাব্দ`;
};

/**
 * Format current time into Bengali (e.g. "সন্ধ্যা ০৭:২৭" or "সকাল ১০:৩০")
 */
export const getFormattedBengaliTime = (
  date: Date = new Date(),
  style: 'prefix' | 'suffix' | 'ampm' = 'prefix'
): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const hStr = toBengaliDigits(h12 < 10 ? `0${h12}` : h12);
  const mStr = toBengaliDigits(minutes < 10 ? `0${minutes}` : minutes);

  let period = '';
  if (hours >= 4 && hours < 6) {
    period = 'ভোর';
  } else if (hours >= 6 && hours < 12) {
    period = 'সকাল';
  } else if (hours >= 12 && hours < 15) {
    period = 'দুপুর';
  } else if (hours >= 15 && hours < 18) {
    period = 'বিকেল';
  } else if (hours >= 18 && hours < 20) {
    period = 'সন্ধ্যা';
  } else {
    period = 'রাত';
  }

  if (style === 'prefix') {
    return `${period} ${hStr}:${mStr}`;
  } else if (style === 'suffix') {
    return `${hStr}:${mStr} ${period}`;
  } else {
    const ampm = hours < 12 ? 'পূর্বাহ্ন' : 'অপরাহ্ন';
    return `${hStr}:${mStr} ${ampm}`;
  }
};

/**
 * Get unified date and time information bundle
 */
export const getFullBengaliDateTimeBundle = (date: Date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return {
    day: getBengaliDayName(date),
    engDate: getFormattedEnglishDate(date),
    bngDate: getFormattedBengaliEraDate(date),
    time: getFormattedBengaliTime(date),
    isoDate: `${y}-${m}-${d}`,
    timeStr: `${hh}:${mm}`,
  };
};

