export const getDate = date => new Date(date).toDateString();

export const getTime = date => {
  return getTimeAMPMFormat(new Date(date));
};

export const getTimeAMPMFormat = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours;
  // appending zero in the start if hours less than 10
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};