sap.ui.define([], function() {
  'use strict';

  if (!Date.daysBetween) {
    Date.daysBetween = function(firstDate, secondDate) {
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    };
  }

  if (!Date.prototype.startOfDay) {
    Date.prototype.startOfDay = function() {
      this.setHours(0, 0, 0, 0);
      return this;
    };
  }

  if (!Date.prototype.endOfDay) {
    Date.prototype.endOfDay = function() {
      this.setHours(23, 59, 59, 999);
      return this;
    };
  }

  if (!Date.prototype.isLeapYear) {
    Date.isLeapYear = function(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    Date.prototype.isLeapYear = function() {
      return Date.isLeapYear(this.getFullYear());
    };
  }

  if (!Date.prototype.getDaysInMonth) {
    Date.getDaysInMonth = function(year, month) {
      return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    Date.prototype.getDaysInMonth = function() {
      return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
    };
  }

  if (!Date.prototype.addMonths) {
    Date.prototype.addMonths = function(value) {
      var n = this.getDate();
      this.setDate(1);
      this.setMonth(this.getMonth() + value);
      this.setDate(Math.min(n, this.getDaysInMonth()));
      return this;
    };
  }

  if (!Date.prototype.addDays) {
    Date.prototype.addDays = function(value) {
      this.setDate(this.getDate() + value * 1);
      return this;
    };
  }
});
