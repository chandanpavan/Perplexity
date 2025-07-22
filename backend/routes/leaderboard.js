const Squad = require('../models/Squad'); // 🔁 at the top if not already imported

// ✅ GET /api/leaderboard/squads
router.get('/squads', async (req, res) => {
  try {
    const squads = await Squad.find({})
      .populate('members', 'email xp totalKills placementPoints')
      .populate('leader', 'email');

    const stats = squads.map((squad) => {
      const totalKills = squad.members.reduce((sum, m) => sum + (m.totalKills || 0), 0);
      const placementPoints = squad.members.reduce((sum, m) => sum + (m.placementPoints || 0), 0);
      const totalXP = squad.members.reduce((sum, m) => sum + (m.xp || 0), 0);
      const memberCount = squad.members.length;
      const avgXP = memberCount ? Math.round(totalXP / memberCount) : 0;

      return {
        squadName: squad.name,
        leader: squad.leader?.email || '-',
        totalKills,
        placementPoints,
        avgXP,
        members: memberCount,
      };
    });

    // Sort by total placement/XP or kills
    const sorted = stats.sort((a, b) => b.avgXP - a.avgXP);

    res.status(200).json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching squad leaderboard' });
  }
});
