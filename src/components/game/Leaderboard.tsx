import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal, Star, Zap, Users } from 'lucide-react';
import { GameSession, GamePlayer, ZoneChampion } from '@/hooks/useGameData';

interface LeaderboardProps {
  topPlayers: (GameSession & { player: GamePlayer })[];
  zoneChampions: ZoneChampion[];
  championshipEnabled: boolean;
  currentPlayerRank?: number;
}

export const Leaderboard = ({ topPlayers, zoneChampions, championshipEnabled, currentPlayerRank }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAGILevel = (score: number) => {
    if (score >= 90) return { level: 'AGI Master', color: 'bg-purple-500', icon: '🧠' };
    if (score >= 80) return { level: 'AI Expert', color: 'bg-blue-500', icon: '🤖' };
    if (score >= 70) return { level: 'Tech Savvy', color: 'bg-green-500', icon: '⚡' };
    if (score >= 60) return { level: 'Learning', color: 'bg-yellow-500', icon: '📚' };
    return { level: 'Beginner', color: 'bg-gray-500', icon: '🌱' };
  };

  return (
    <div className="space-y-6">
      {/* Championship Status */}
      {championshipEnabled && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              โหมดแชมป์เปิดแล้ว!
            </CardTitle>
            <CardDescription>
              มีผู้เล่นมากกว่า 100 คนแล้ว การแข่งขันหาแชมป์ประจำเดือนเริ่มต้นขึ้น
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Global Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            อันดับผู้เล่นชั้นนำ
          </CardTitle>
          <CardDescription>
            ผู้เล่นที่มีคะแนน AGI Similarity สูงสุด
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPlayers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>ยังไม่มีผู้เล่นในอันดับ</p>
                <p className="text-sm">เป็นคนแรกที่เข้าร่วมเกม!</p>
              </div>
            ) : (
              topPlayers.map((player, index) => {
                const rank = index + 1;
                const agiLevel = getAGILevel(player.agi_similarity_score);
                
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20' : 'bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                        <span className="font-bold text-lg">#{rank}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{player.player.display_name}</h3>
                          {player.player.is_ai && (
                            <Badge variant="secondary" className="text-xs">
                              🤖 AI
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>คะแนน: {player.total_score}</span>
                          <span>แม่นยำ: {player.total_questions > 0 ? Math.round((player.correct_answers / player.total_questions) * 100) : 0}%</span>
                          <span>ต่อเนื่อง: {player.current_streak}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{agiLevel.icon}</span>
                        <Badge className={`${agiLevel.color} text-white`}>
                          {agiLevel.level}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {player.agi_similarity_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">AGI Similarity</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {currentPlayerRank && currentPlayerRank > 10 && (
            <div className="mt-4 p-3 border-t">
              <div className="text-center text-sm text-muted-foreground">
                <Zap className="h-4 w-4 inline mr-1" />
                อันดับของคุณ: #{currentPlayerRank}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zone Champions */}
      {zoneChampions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              แชมป์ประจำโซน
            </CardTitle>
            <CardDescription>
              ผู้นำในแต่ละหมวดหมู่อัลกอริทึม
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zoneChampions.map((champion) => (
                <div key={champion.id} className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold capitalize">{champion.zone_identifier}</h4>
                      <p className="text-sm text-muted-foreground">
                        AGI Score: {champion.champion_agi_similarity.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};