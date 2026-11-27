// US-08 Enter a match result
import { saveResult } from '../repo/resultsRepo.js';

export default function registerResultRoutes(app, { store }) {
  app.put('/api/matches/:id/result', async (req, res) => {
    const { homeGoals, awayGoals } = req.body ?? {};
    const match = await saveResult(store, Number(req.params.id), homeGoals, awayGoals);
    res.json(match);
  });
}
