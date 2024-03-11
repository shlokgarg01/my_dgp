export const Dates = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
  { value: 11, label: 11 },
  { value: 12, label: 12 },
  { value: 13, label: 13 },
  { value: 14, label: 14 },
  { value: 15, label: 15 },
  { value: 16, label: 16 },
  { value: 17, label: 17 },
  { value: 18, label: 18 },
  { value: 19, label: 19 },
  { value: 20, label: 20 },
  { value: 21, label: 21 },
  { value: 22, label: 22 },
  { value: 23, label: 23 },
  { value: 24, label: 24 },
  { value: 25, label: 25 },
  { value: 26, label: 26 },
  { value: 27, label: 27 },
  { value: 28, label: 28 },
  { value: 29, label: 29 },
  { value: 30, label: 30 },
  { value: 31, label: 31 },
];

export const Months = [
  { value: "01", label: "January", abr: "Jan" },
  { value: "02", label: "February", abr: "Feb" },
  { value: "03", label: "March", abr: "Mar" },
  { value: "04", label: "April", abr: "Apr" },
  { value: "05", label: "May", abr: "May" },
  { value: "06", label: "June", abr: "Jun" },
  { value: "07", label: "July", abr: "Jul" },
  { value: "08", label: "August", abr: "Aug" },
  { value: "09", label: "September", abr: "Sep" },
  { value: "10", label: "October", abr: "Oct" },
  { value: "11", label: "November", abr: "Nov" },
  { value: "12", label: "December", abr: "Dec" },
];

export const Years = [
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
  { value: "2031", label: "2031" },
  { value: "2032", label: "2032" },
  { value: "2033", label: "2033" },
  { value: "2034", label: "2034" },
  { value: "2035", label: "2035" },
  { value: "2036", label: "2036" },
  { value: "2037", label: "2037" },
  { value: "2038", label: "2038" },
  { value: "2039", label: "2039" },
  { value: "2040", label: "2040" },
  { value: "2041", label: "2041" },
  { value: "2042", label: "2042" },
  { value: "2043", label: "2043" },
  { value: "2044", label: "2044" },
  { value: "2045", label: "2045" },
  { value: "2046", label: "2046" },
];

export const Hours = [
  { value: "00", label: "00" },
  { value: "01", label: "01" },
  { value: "02", label: "02" },
  { value: "03", label: "03" },
  { value: "04", label: "04" },
  { value: "05", label: "05" },
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "09", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" }
];

export const Quaters = [
  {value: "00", label: "00"},
  {value: "15", label: "15"},
  {value: "30", label: "30"},
  {value: "45", label: "45"},
]

export const AmPm = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" }
];


export const generateDatesArray = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // Note: Month starts from 0 (January)

  const dates = [];

  // Loop through the next 31 days
  for (let i = currentDay; i <= currentDay + 31; i++) {
    const date = new Date(currentDate.getFullYear(), currentMonth - 1, i);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const formattedDate = `${day} ${month}`;

    // Check if the date is in the future (excluding current date)
    if (date > currentDate) {
      dates.push({ value: i, label: formattedDate });
    }
  }

  return dates;
};


export const tryDate = generateDatesArray()

export const Minutes = [];
for (let i = 0; i < 60; i++) {
  const value = i < 10 ? `0${i}` : `${i}`; // Pad single-digit numbers with leading zero
  Minutes.push({ value, label: value });
}

