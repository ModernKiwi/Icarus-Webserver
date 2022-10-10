//  TODO: Clean up Code.
//  TODO: Documentation.
//  TODO: CSS degisn.

import React, { useState } from 'react';
import styles from './Calendar.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

type calendarProps = {
  targetDate?: Date;
};

type dateType = {
  key: number;
  date?: Date;
  ClassNames: Array<string>;
  acheivementRating?: number; //  Needs implimentation with database
  moodRating?: number; //  Needs implimentation with database
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

function isTodaysDate(currentDate: Date, todaysDate: Date) {
  const isCurrentDay = currentDate.getDate() === todaysDate.getDate() ? true : false;
  const isCurrentMonth = currentDate.getMonth() === todaysDate.getMonth() ? true : false;
  const isCurrentYear = currentDate.getFullYear() === todaysDate.getFullYear() ? true : false;

  return isCurrentDay && isCurrentMonth && isCurrentYear;
}

function isTargetDay(currentDate: Date, targetDate?: Date) {
  if (targetDate == undefined) return false;

  const isCurrentDay = currentDate.getDate() === targetDate.getDate() ? true : false;
  const isCurrentMonth = currentDate.getMonth() === targetDate.getMonth() ? true : false;
  const isCurrentYear = currentDate.getFullYear() === targetDate.getFullYear() ? true : false;

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

function makecalendarDatesObj(selectedMonthYear: Date, todaysDate: Date, targetDate?: Date) {
  const startingPosition = getStartingPosition(selectedMonthYear);
  const totalDays = getMonthsDateCount(selectedMonthYear);
  const wrappedDatesCount = Math.max(totalDays + startingPosition - 35, 0);
  const blankDatesCount = startingPosition - wrappedDatesCount;
  const month = selectedMonthYear.getMonth();
  const year = selectedMonthYear.getFullYear();

  const CalendarDateArray: Array<dateType> = [];

  let keyNumber = 0;

  //  Build Wrapped to top days if any.
  if (wrappedDatesCount > 0)
    for (let steps = wrappedDatesCount - 1; steps >= 0; steps--) {
      const dateNumber = totalDays - steps;
      const objectDate = new Date(year, month, dateNumber);
      const isToday = isTodaysDate(objectDate, todaysDate);
      const isTarget = isTargetDay(objectDate, targetDate);
      CalendarDateArray.push(
        makeCalendarDateObj(keyNumber++, objectDate, isToday, isTarget, undefined, undefined)
      );
    }

  //  Build Spaces if calendar does not start at begining
  if (blankDatesCount > 0)
    for (let steps = 0; steps < blankDatesCount; steps++) {
      CalendarDateArray.push(makeCalendarDateObj(keyNumber++));
    }

  //  Add in the rest of the normal days to the calendar
  for (let steps = 0; steps < totalDays - wrappedDatesCount; steps++) {
    const dateNumber = steps + 1;
    const objectDate = new Date(year, month, dateNumber);
    const isToday = isTodaysDate(objectDate, todaysDate);
    const isTarget = isTargetDay(objectDate, targetDate);
    CalendarDateArray.push(
      makeCalendarDateObj(keyNumber++, objectDate, isToday, isTarget, undefined, undefined)
    );
  }

  return CalendarDateArray;
}

function makeCalendarDateObj(
  keyNumber: number,
  objectDate?: Date,
  isCurrentDate?: boolean,
  isTargetDate?: boolean,
  acheivementRating?: number,
  moodRating?: number
) {
  const cssClassName = ['calendar__Dates__datecontainer'];
  if (isCurrentDate) cssClassName.push('calendar__Date__datecontainer--current');
  if (isTargetDate) cssClassName.push('calendar__Date__datecontainer--target');

  const dateObject: dateType = {
    key: keyNumber,
    date: objectDate,
    ClassNames: cssClassName,
    acheivementRating: undefined,
    moodRating: undefined,
  };

  return dateObject;
}

export const Calendar: React.FC<calendarProps> = (Props) => {
  const [todaysDate] = useState(new Date());
  const [selectedMonthYear, setselectedMonthYear] = useState(
    Props.targetDate != undefined
      ? new Date(Props.targetDate.getFullYear(), Props.targetDate.getMonth())
      : new Date(todaysDate.getFullYear(), todaysDate.getMonth())
  );
  const [calendarDates, setCalendarDates] = useState(
    makecalendarDatesObj(selectedMonthYear, todaysDate, Props.targetDate)
  );

  const monthName = getMonthsName(selectedMonthYear);
  const monthValue = selectedMonthYear.getMonth();
  const year = selectedMonthYear.getFullYear();

  function previousMonth() {
    let newSelectedMonthYear = selectedMonthYear;
    newSelectedMonthYear.setMonth(monthValue - 1);
    setselectedMonthYear(newSelectedMonthYear);
    setCalendarDates(makecalendarDatesObj(newSelectedMonthYear, todaysDate, Props.targetDate));
  }

  function nextMonth() {
    let newSelectedMonthYear = selectedMonthYear;
    newSelectedMonthYear.setMonth(monthValue + 1);
    setselectedMonthYear(newSelectedMonthYear);
    setCalendarDates(makecalendarDatesObj(newSelectedMonthYear, todaysDate, Props.targetDate));
  }

  function previousYear() {
    let newSelectedMonthYear = selectedMonthYear;
    newSelectedMonthYear.setMonth(monthValue - 12);
    setselectedMonthYear(newSelectedMonthYear);
    setCalendarDates(makecalendarDatesObj(newSelectedMonthYear, todaysDate, Props.targetDate));
  }

  function nextYear() {
    let newSelectedMonthYear = selectedMonthYear;
    newSelectedMonthYear.setMonth(monthValue + 12);
    setselectedMonthYear(newSelectedMonthYear);
    setCalendarDates(makecalendarDatesObj(newSelectedMonthYear, todaysDate, Props.targetDate));
  }

  return (
    <div className='calendar devIndicator'>
      <div className='calendar__MonthYear'>
        <button onClick={() => previousYear()}>{`<<`}</button>
        <button onClick={() => previousMonth()}>{`<`}</button>
        <h3>
          {monthName} {year}
        </h3>
        <button onClick={() => nextMonth()}>{`>`}</button>
        <button onClick={() => nextYear()}>{`>>`}</button>
      </div>
      <div className='calendar__Days'>
        {DayNames.map((DayName) => (
          <h4 key={DayName}>{DayName}</h4>
        ))}
      </div>
      <div className='calendar__Dates'>
        {calendarDates.map((date) => (
          <div key={date.key} className={date.ClassNames?.join(' ')}>
            <div>{date.date?.getDate()}</div>
            <div></div>
            <div>🏆</div>
            <div>😐</div>
          </div>
        ))}
      </div>
    </div>
  );
};
