import dayjs, { unix } from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export const getFormatTime = (timeSec, type = 0) => {
    let unix_timestamp = timeSec
    // console.log(unix_timestamp);
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // console.log(date);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    var day = date.getDate();
    var mounth = date.getMonth() + 1;

    var year = date.getFullYear();

    var dateFormat = `${day}/${mounth}/${year}`;

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    // console.log(formattedTime);

    if(type == 0){ // date
        return dateFormat;
    } else if(type == 1){ // time
        return formattedTime;
    } else { // date time
        return `${dateFormat}   ${formattedTime}`
    }
}


export const dateFromNow = (timeSec) => {
    var date = new Date(timeSec.toNumber() * 1000);
    return dayjs(date).fromNow(true);
}

export const dateFromNowWithDateType = (dateType) => {
    let date = new Date(dateType);
    return dayjs(date).fromNow(true);
}

export const getDiffDay = (_start) => {
    let StartDate = new Date();
    let EndDate = new Date(_start * 1000);
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;
  
    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());
  
    // so it's safe to divide by 24 hours
    let days = (start - end) / oneDay;
    return `Day ${days}`
  }