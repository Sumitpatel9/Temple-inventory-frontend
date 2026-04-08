import React from 'react';

const DateDisplay = ({ date, className = "" }) => {
  if (!date) return <span className={className}>—</span>;

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date)).replace(",", "");

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {formattedDate}
    </span>
  );
};

export default DateDisplay;