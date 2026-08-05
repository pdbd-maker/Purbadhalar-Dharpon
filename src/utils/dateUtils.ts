// Utility functions for converting numbers and formatting dates into Bengali

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
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
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
  const day = toBengaliDigits(date.getDate());
  const month = getBengaliMonthName(date.getMonth());
  const year = toBengaliDigits(date.getFullYear());
  return `${day} ${month} ${year}`;
};

// Simple Bengali Era (Bangla Calendar) calculation approximation
export const getFormattedBengaliEraDate = (date: Date = new Date()): string => {
  const month = date.getMonth(); // 0 - 11
  const day = date.getDate();
  const year = date.getFullYear();

  // Basic calculation for Bangla Year (Bangla Era = Gregorian - 593 or 594 depending on April 14 Pohela Boishakh)
  let bngYear = year - 593;
  let bngMonth = 'জ্যৈষ্ঠ';
  let bngDay = day + 17;

  // Approximate Bengali Month mapping
  if (month === 0) {
    // Jan
    bngMonth = day > 13 ? 'মাঘ' : 'পৌষ';
    bngDay = day > 13 ? day - 13 : day + 17;
    if (day <= 13) bngYear = year - 594;
  } else if (month === 1) {
    // Feb
    bngMonth = day > 12 ? 'ফাল্গুন' : 'মাঘ';
    bngDay = day > 12 ? day - 12 : day + 17;
  } else if (month === 2) {
    // Mar
    bngMonth = day > 14 ? 'চৈত্র' : 'ফাল্গুন';
    bngDay = day > 14 ? day - 14 : day + 16;
  } else if (month === 3) {
    // Apr
    bngMonth = day > 13 ? 'বৈশাখ' : 'চৈত্র';
    bngDay = day > 13 ? day - 13 : day + 16;
    if (day > 13) bngYear = year - 593;
  } else if (month === 4) {
    // May
    bngMonth = day > 14 ? 'জ্যৈষ্ঠ' : 'বৈশাখ';
    bngDay = day > 14 ? day - 14 : day + 17;
  } else if (month === 5) {
    // Jun
    bngMonth = day > 14 ? 'আষাঢ়' : 'জ্যৈষ্ঠ';
    bngDay = day > 14 ? day - 14 : day + 16;
  } else if (month === 6) {
    // Jul
    bngMonth = day > 15 ? 'শ্রাবণ' : 'আষাঢ়';
    bngDay = day > 15 ? day - 15 : day + 16;
  } else if (month === 7) {
    // Aug
    bngMonth = day > 16 ? 'ভাদ্র' : 'শ্রাবণ';
    bngDay = day > 16 ? day - 16 : day + 16;
  } else if (month === 8) {
    // Sep
    bngMonth = day > 16 ? 'আশ্বিন' : 'ভাদ্র';
    bngDay = day > 16 ? day - 16 : day + 15;
  } else if (month === 9) {
    // Oct
    bngMonth = day > 16 ? 'কার্তিক' : 'আশ্বিন';
    bngDay = day > 16 ? day - 16 : day + 15;
  } else if (month === 10) {
    // Nov
    bngMonth = day > 15 ? 'অগ্রহায়ণ' : 'কার্তিক';
    bngDay = day > 15 ? day - 15 : day + 15;
  } else if (month === 11) {
    // Dec
    bngMonth = day > 15 ? 'পৌষ' : 'অগ্রহায়ণ';
    bngDay = day > 15 ? day - 15 : day + 15;
  }

  return `${toBengaliDigits(bngDay)} ${bngMonth} ${toBengaliDigits(bngYear)}`;
};
