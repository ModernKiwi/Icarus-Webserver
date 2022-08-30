//  TODO: Refactor Code.
//  TODO: Work on Documentation
//  TODO: Change Calendar Day constructor to use Date instead of numbers
//  TODO: Build CSS classnames in each Date object
//  TODO: Add highlight to current day (on current month only)
//  TODO: * Add function to change Month and either a dropdown or buttons for Year
//  Next thing to work on is highlighted by *

import React, { useState } from 'react';
import styles from './Calendar.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

type calendarProps = {
  startingDate?: Date;
};

type dateType = {
  key: number;
  dateNumber?: number;
  currentDay?: boolean;
  acheivementRating?: number; //  Needs implimentation with database
  moodRating?: number; //  Needs implimentation with database
  ClassNames?: Array<string>;
};

//  Variables

const DayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MonthDateCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//  Utils
function isleapYear(year: number) {
  return (year & 3) == 0 && (year % 25 != 0 || (year & 15) == 0);
}

function getMonthsName(date: Date) {
  return MonthNames[date.getMonth()];
}

function getMonthsDateCount(date: Date) {
  const month = date.getMonth();
  if (month != 1) return MonthDateCount[month];

  if (isleapYear(date.getFullYear())) return MonthDateCount[month] + 1;
  else return MonthDateCount[month];
}

//  Functions
function getStartingPosition(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month, 1).getDay();
}

function calendarDateBuilder(date: Date) {
  const startingPosition = getStartingPosition(date);
  const totalDays = getMonthsDateCount(date);
  const wrappedDaysCount = Math.max(totalDays + startingPosition - 35, 0);

  const CalendarDateArray: Array<dateType> = [];

  let keyNumber = 0;

  //  Build Wrapped to top days if any.
  if (wrappedDaysCount > 0)
    for (let steps = wrappedDaysCount - 1; steps >= 0; steps--) {
      const key = keyNumber;
      keyNumber++;
      const dateNumber = totalDays - steps;
      const isToday = date.getDate() === dateNumber ? true : false;
      const dateObject: dateType = {
        key: key,
        dateNumber: dateNumber,
        currentDay: isToday,
      };
      CalendarDateArray.push(dateObject);
    }

  //  Build Spaces if calendar does not start at begining
  if (startingPosition > 0) {
    const blankSpaces = startingPosition - wrappedDaysCount;
    for (let steps = 0; steps < blankSpaces; steps++) {
      const key = keyNumber;
      keyNumber++;
      const dateObject: dateType = {
        key: key,
      };
      CalendarDateArray.push(dateObject);
    }
  }

  //  Build Spaces if calendar does not start at begining

  for (let steps = 0; steps < totalDays - wrappedDaysCount; steps++) {
    const key = keyNumber;
    keyNumber++;
    const isToday = date.getDate() === steps + 1 ? true : false;
    const dateObject: dateType = {
      key: key,
      dateNumber: steps + 1,
      currentDay: isToday,
    };
    CalendarDateArray.push(dateObject);
  }

  return CalendarDateArray;
}

export const Calendar: React.FC<calendarProps> = (Props) => {
  //  Note: possible bug introduction below
  const [todaysDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(todaysDate);
  const [calendarDates, setCalendarDates] = useState(calendarDateBuilder(currentDate));

  //  Note: This may break operation of changing months/years
  if (Props.startingDate != undefined && currentDate == todaysDate) {
    setCurrentDate(Props.startingDate);
    setCalendarDates(calendarDateBuilder(currentDate));
  }

  const month = getMonthsName(currentDate);
  const year = currentDate.getFullYear();
  // let calendarDates = calendarDateBuilder(currentDate);

  function previousMonth(date: Date) {
    const newMonthValue = date.getMonth() - 1;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    setCurrentDate(newDate);
    setCalendarDates(calendarDateBuilder(newDate));
  }

  function nextMonth(date: Date) {
    const newMonthValue = date.getMonth() + 1;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    console.log(newDate);

    setCurrentDate(newDate);
    setCalendarDates(calendarDateBuilder(newDate));
  }

  function previousYear(date: Date) {
    const newMonthValue = date.getMonth() - 12;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    setCurrentDate(newDate);
    setCalendarDates(calendarDateBuilder(newDate));
  }

  function nextYear(date: Date) {
    const newMonthValue = date.getMonth() + 12;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    console.log(newDate);

    setCurrentDate(newDate);
    setCalendarDates(calendarDateBuilder(newDate));
  }

  return (
    <div className='calendar devIndicator'>
      <div className='calendar__MonthYear'>
        <button onClick={() => previousYear(currentDate)}>{`<<`}</button>
        <button onClick={() => previousMonth(currentDate)}>{`<`}</button>
        <h3>
          {month} {year}
        </h3>
        <button onClick={() => nextMonth(currentDate)}>{`>`}</button>
        <button onClick={() => nextYear(currentDate)}>{`>>`}</button>
      </div>
      <div className='calendar__Days'>
        {DayNames.map((DayName) => (
          <h4 key={DayName}>{DayName}</h4>
        ))}
      </div>
      <div className='calendar__Dates'>
        {calendarDates.map((date) => (
          <div key={date.key} className='calendar__Dates__date'>
            {date.dateNumber}
          </div>
        ))}
      </div>
    </div>
  );
};
