sap.ui.define(['sap/ui/core/format/DateFormat', 'sap/ui/core/format/FileSizeFormat'], function(
  DateFormat,
  FileSizeFormat
) {
  'use strict';
  var oFormatter = {};

  oFormatter.DateFormats = {
    Year: DateFormat.getDateInstance({
      pattern: 'YYYY'
    }),
    Quarter: DateFormat.getDateInstance({
      pattern: 'QQQQ YYYY'
    }),
    Month: DateFormat.getDateInstance({
      pattern: 'MMMM YYYY'
    }),
    Week: DateFormat.getDateInstance({
      pattern: 'w'
    }),
    Day: DateFormat.getDateInstance({
      style: 'short'
    }),
    DayTime: DateFormat.getDateInstance({
      pattern: 'dd.MM.yyyy ss:mm'
    }),
    MonthDay: DateFormat.getDateInstance({
      style: 'medium'
    })
  };

  oFormatter.formatAttribute = function(sValue, sType) {
    if (sType === 'size') {
      return FileSizeFormat.getInstance({
        binaryFilesize: false,
        maxFractionDigits: 1,
        maxIntegerDigits: 3
      }).format('' + sValue);
    } else {
      return sValue;
    }
  };

  return oFormatter;
});
