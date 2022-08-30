//  TODO: Refactor Code.
//  TODO: Work on Documentation
//  TODO: Change Calendar Day constructor to use Date instead of numbers
//  TODO: Build CSS classnames in each Date object
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

function isCurrentDayMonthYear(date: Date, currentDateNumber: number) {
  const currentDate = new Date();
  const isCurrentDay = currentDate.getDate() === currentDateNumber ? true : false;
  const isCurrentMonth = currentDate.getMonth() === date.getMonth() ? true : false;
  const isCurrentYear = currentDate.getFullYear() === date.getFullYear() ? true : false;

  return isCurrentDay && isCurrentMonth && isCurrentYear;
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

function getStartingPosition(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month, 1).getDay();
}

function calendarDatesBuilder(date: Date) {
  const startingPosition = getStartingPosition(date);
  const totalDays = getMonthsDateCount(date);
  const wrappedDatesCount = Math.max(totalDays + startingPosition - 35, 0);
  const blankDatesCount = startingPosition - wrappedDatesCount;

  const CalendarDateArray: Array<dateType> = [];

  let keyNumber = 0;

  //  Build Wrapped to top days if any.
  if (wrappedDatesCount > 0)
    for (let steps = wrappedDatesCount - 1; steps >= 0; steps--) {
      const dateNumber = totalDays - steps;
      const isToday = isCurrentDayMonthYear(date, dateNumber);
      CalendarDateArray.push(makeCalendarDateObject(keyNumber++, dateNumber, isToday));
    }

  //  Build Spaces if calendar does not start at begining
  if (blankDatesCount > 0)
    for (let steps = 0; steps < blankDatesCount; steps++) {
      CalendarDateArray.push(makeCalendarDateObject(keyNumber++));
    }

  //  Add in the rest of the normal days to the calendar
  for (let steps = 0; steps < totalDays - wrappedDatesCount; steps++) {
    const dateNumber = steps + 1;
    const isToday = isCurrentDayMonthYear(date, dateNumber);
    CalendarDateArray.push(makeCalendarDateObject(keyNumber++, steps + 1, isToday));
  }

  return CalendarDateArray;
}

function makeCalendarDateObject(
  keyNumber: number,
  dateNumber?: number,
  currentDay?: boolean,
  acheivementRating?: number,
  moodRating?: number
) {
  const cssClassName = ['calendar__Dates__date'];
  if (currentDay) cssClassName.push('calendar__Date__date--currentDay');

  const dateObject: dateType = {
    key: keyNumber,
    dateNumber: dateNumber,
    currentDay: currentDay,
    acheivementRating: undefined,
    moodRating: undefined,
    ClassNames: cssClassName,
  };

  return dateObject;
}

export const Calendar: React.FC<calendarProps> = (Props) => {
  const [todaysDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(
    Props.startingDate != undefined ? Props.startingDate : todaysDate
  );
  const [calendarDates, setCalendarDates] = useState(calendarDatesBuilder(currentDate));

  const month = getMonthsName(currentDate);
  const year = currentDate.getFullYear();

  function previousMonth(date: Date) {
    const newMonthValue = date.getMonth() - 1;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    setCurrentDate(newDate);
    setCalendarDates(calendarDatesBuilder(newDate));
  }

  function nextMonth(date: Date) {
    const newMonthValue = date.getMonth() + 1;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    setCurrentDate(newDate);
    setCalendarDates(calendarDatesBuilder(newDate));
  }

  function previousYear(date: Date) {
    const newMonthValue = date.getMonth() - 12;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    setCurrentDate(newDate);
    setCalendarDates(calendarDatesBuilder(newDate));
  }

  function nextYear(date: Date) {
    const newMonthValue = date.getMonth() + 12;
    let newDate = date;
    newDate.setMonth(newMonthValue);

    setCurrentDate(newDate);
    setCalendarDates(calendarDatesBuilder(newDate));
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
          <div key={date.key} className={date.ClassNames?.join(' ')}>
            {date.dateNumber}
          </div>
        ))}
      </div>
    </div>
  );
};
