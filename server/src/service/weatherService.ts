import dotenv from "dotenv";

dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor( city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;

  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    const response = await fetch(
      `${this.baseURL}/data/2.5/weather?q=${query}&APPID=${this.apiKey}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const { lat, lon } = coordinates;
    const response = await fetch(
      `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return response.json();
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    const locations = await this.fetchLocationData(city);
    if (locations.length === 0) {
      throw new Error("No location found for the specified city");
    }
    const coordinates = this.destructureLocationData(locations); // Get the first match
    const weatherData = await this.fetchWeatherData(coordinates);
    const weatherList = [];
    for (let i = 0; i < weatherData.list.length; i+=8) {
      const element = weatherData.list[i];
      weatherList.push(element);
    }
    weatherList.push(weatherData.list.at(-1));
    const weatherOutput = weatherList.map(weatherData=>new Weather(
      city,
      weatherData.dt_txt,
      weatherData.weather[0].icon,
      weatherData.weather[0].description,
      weatherData.main.temp,
      weatherData.wind.speed,
      weatherData.main.humidity
    ));
    
    // console.table(weatherOutput);

    //NEED TO return THE DATA IN A FORMAT ASKED ON LINE 50 & 51 FROM main.ts (front end): make a for loop to filter out only the next 5 days.
    return weatherOutput;
  }
}

export default new WeatherService();