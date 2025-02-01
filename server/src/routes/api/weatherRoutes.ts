import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: "City name is required." });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    await HistoryService.addCity(cityName);

    return res.status(200).json(weatherData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching weather data." });
  }
});

// TODO: GET search history
router.get("/history", async (_: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching search history." });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(204).send(); // No content response
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while deleting the city from history.",
    });
  }
});

export default router;