// US-05 Generate round-robin fixtures (the read side also serves the fixtures pages)
import { generateAndSaveFixtures } from '../repo/matchesRepo.js';
import { groupByRound } from '../logic/fixtures.js';

export default function registerFixtureRoutes(app, { store }) {
  app.get('/api/fixtures', async (_req, res) => {
    const db = await store.read();
    const nameOf = new Map(db.teams.map((t) => [t.id, t.name]));

    const rounds = groupByRound(db.matches, db.teams).map(({ round, matches, resting }) => ({
      round,
      resting: resting.map((id) => nameOf.get(id)),
      matches: matches.map((m) => ({
        id: m.id,
        homeTeam: nameOf.get(m.homeTeamId),
        awayTeam: nameOf.get(m.awayTeamId),
        homeGoals: m.homeGoals,
        awayGoals: m.awayGoals,
        status: m.status,
      })),
    }));

    res.json({ generated: db.matches.length > 0, rounds });
  });

  app.post('/api/fixtures/generate', async (_req, res) => {
    const matches = await generateAndSaveFixtures(store);
    res.status(201).json({ matchCount: matches.length });
  });
}
