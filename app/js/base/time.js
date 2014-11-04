function GameTime (timestamp) {
  this.time = timestamp || GameTime.time;
  return this.get();
}

GameTime.prototype = {
  get: function () {
    if (!this.minute) {
      var time = this.time;

      this.year = Math.floor(time / GameTime.YEAR);
      this.years = Math.floor(this.time / GameTime.YEAR);
      time = time - this.year * GameTime.YEAR;
      this.season = Math.floor(time / GameTime.SEASON);
      this.seasons = Math.floor(this.time / GameTime.SEASON);
      time = time - this.season * GameTime.SEASON;
      this.month = Math.floor(time / GameTime.MONTH);
      this.months = Math.floor(this.time / GameTime.MONTH);
      time = time - this.month * GameTime.MONTH;
      this.day = Math.floor(time / GameTime.DAY);
      this.days = Math.floor(this.time / GameTime.DAY);
      time = time - this.day * GameTime.DAY;
      this.hour = Math.floor(time / GameTime.HOUR);
      this.hours = Math.floor(this.time / GameTime.HOUR);
      time = time - this.hour * GameTime.HOUR;
      this.minute = Math.floor(time);
      this.minutes = Math.floor(this.time);
    }
    return this;
  },
  toString: function () {
    if (!this.string) {
      var dayOfWeek = GameTime.DAY_NAMES[Math.floor((this.time / GameTime.DAY) % 7)];
      this.string =
          dayOfWeek + ' ' + GameTime.MONTH_NAMES[this.month] + ' ' + this.day + ' ' + this.year +
          ' ' + this.hour + ':' + this.minute;
    }
    return this.string;
  }
};

GameTime.HOUR = 60;
GameTime.DAY = GameTime.HOUR * 24;
GameTime.MONTH = GameTime.DAY * 30; // 4 weeks
GameTime.SEASON = GameTime.MONTH * 2;
GameTime.YEAR = GameTime.SEASON * 4; // 4 seasons

GameTime.MINUTE = 1200 / 100; // 1.2 sec per minute
GameTime.DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
GameTime.MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'September', 'October'];
GameTime.start = function (time) {
  if (time) this.time = time;
  else this.time = 0;
};
GameTime.now = function () { return GameTime.time; };
GameTime.tick = function (realtime) {
  if (this.time === undefined) return; // not started

  this.realtime = this.realtime || realtime;
  var minutes = (realtime - this.realtime) / GameTime.MINUTE,
      time = this.time + minutes;
  this.time = time;
  this.realtime = realtime;
};

