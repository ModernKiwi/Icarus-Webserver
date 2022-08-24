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
  targetDate?: Date;
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
  return MonthNames[date.getMonth() - 1];
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
  const wrappedDaysCountUncleaned = totalDays + startingPosition - 35;
  // TODO: Clean function to avoid negative values
  const wrappedDaysCount = wrappedDaysCountUncleaned < 0 ? 0 : wrappedDaysCountUncleaned;

  const wrappedDates: Array<dateType> = [];
  const blankDates: Array<dateType> = [];
  const nonwrappedDates: Array<dateType> = [];

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
      wrappedDates.push(dateObject);
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
      blankDates.push(dateObject);
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
    nonwrappedDates.push(dateObject);
  }

  // Combine the 3 arrays in order
  const calendarDates = wrappedDates.concat(blankDates, nonwrappedDates);

  return calendarDates;
}

//  React Function Class

export const Calendar: React.FC<calendarProps> = (Props) => {
  const [todaysDate] = useState(new Date());
  const [activeDate, setactiveDate] = useState(todaysDate);

  if (Props.targetDate != undefined && activeDate != Props.targetDate)
    setactiveDate(Props.targetDate);

  const month = getMonthsName(activeDate);
  const year = activeDate.getFullYear();
  const calendarDates = calendarDateBuilder(activeDate);

  return (
    <div className='calendar devIndicator'>
      <div className='calendar__MonthYear'>
        <h3>
          {month} {year}
        </h3>
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
