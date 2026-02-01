const moment = require('moment-jalaali')

exports.randomCode = () => {
  var min = 10000;
  var max = 90000;
  var num = Math.floor(Math.random() * min) + max;
  return num;
};

exports.generateRandomDeviceId = () => {
  var min = 100000000000000;
  var max = 900000000000000;
  var num = Math.floor(Math.random() * min) + max;
  return num;
}

exports.getRefreshRateType = (type) => {
    switch (type) {
      case 1:
        return 1;
      case 2:
        return 3;
      case 3:
        return 5;
      case 4:
        return 15;
      case 5:
        return 30;
      case 6:
        return 60;
      case 7:
        return 120;
      case 8:
        return 360;
      case 9:
        return 720;
      case 10:
        return 1440;
    }
  };

  // Example: Get weather data for your AI thermostat
// You can run this in Node.js or browser (with slight changes)

exports.getWeatherData = async (latitude, longitude) => {
  return null;
  if (!latitude || !longitude) {
    console.log("Unknown location of device!");
    return null;
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
              `&current_weather=true` +
              `&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,cloudcover,shortwave_radiation,weathercode`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    // Extract useful features for ML model
    const current = data.current_weather;
    const hourly = data.hourly;

    // Build structured feature data
    const weatherFeatures = {
      outside_temperature: current.temperature,            // °C
      outside_wind_speed: current.windspeed,               // km/h
      weather_code: current.weathercode,                   // numeric condition
      humidity: hourly.relativehumidity_2m[0],             // %
      cloud_cover: hourly.cloudcover[0],                   // %
      solar_radiation: hourly.shortwave_radiation[0],      // W/m²
      timestamp: current.time                              // ISO time
    };

    console.log("Weather features for ML model:", weatherFeatures);
    return weatherFeatures;

  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}

exports.isTodayHoliday = async () => {
  return false;
  try {
    const today = moment();
    const response = await fetch(`https://holidayapi.ir/jalali/${today.jYear()}/${today.jMonth()+1}/${today.jDate()}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.is_holiday;
  } catch (err) {
    console.error("Failed to fetch holiday data:", err);
    return false;
  }
}
