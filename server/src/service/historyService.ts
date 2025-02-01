import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile("db/searchHistory.json", {
        encoding: "utf8",
      });
      return JSON.parse(data) as City[];
    } catch (err) {
      console.error("Error reading cities:", err);
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(
      "db/searchHistory.json",
      JSON.stringify(cities, null, "\t"),
    );
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(city: string): Promise<City> {
    if (!city) {
      throw new Error("City cannot be blank");
    }

    const newCity = new City(city, uuidv4());
    const cities = await this.getCities();

    if (cities.some((existingCity) => existingCity.name === city)) {
      return newCity; // Handle duplicates as needed
    }

    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const filteredCities = cities.filter((city) => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();