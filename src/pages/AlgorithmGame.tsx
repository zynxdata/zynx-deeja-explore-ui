import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, BookOpen, MessageSquare, Dna, Shuffle, CheckCircle, XCircle, Trophy, Crown, Users } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useGameData } from '@/hooks/useGameData';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import { Leaderboard } from '@/components/game/Leaderboard';

interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  zynxScenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

interface GameStats {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  currentStreak: number;
  bestStreak: number;
}

const algorithms: Algorithm[] = [
  // 🎯 Reinforcement Learning
  { id: 'ppo', name: 'PPO', category: 'reinforcement', description: 'Proximal Policy Optimization', zynxScenario: 'Deeja ต้องการเรียนรู้จากการสนทนากับผู้ใช้เพื่อปรับปรุงการตอบสนองโดยไม่เปลี่ยนแปลงมากเกินไป', difficulty: 'hard', icon: '🎯' },
  { id: 'q-learning', name: 'Q-Learning', category: 'reinforcement', description: 'Value-based reinforcement learning', zynxScenario: 'ระบบ Context Engine ต้องเรียนรู้ว่าการตัดสินใจแบบไหนให้ผลลัพธ์ที่ดีที่สุดในแต่ละสถานการณ์', difficulty: 'medium', icon: '🎯' },
  { id: 'actor-critic', name: 'Actor-Critic', category: 'reinforcement', description: 'Combines value and policy-based methods', zynxScenario: 'Zynx ต้องการสมดุลระหว่างการสำรวจคำตอบใหม่และการใช้ความรู้เดิมที่ได้ผล', difficulty: 'hard', icon: '🎯' },
  { id: 'dqn', name: 'Deep Q-Network', category: 'reinforcement', description: 'Deep learning for Q-learning', zynxScenario: 'ระบบแนะนำอัลกอริทึมของ Zynx ต้องเรียนรู้จากประสบการณ์การใช้งานที่ซับซ้อน', difficulty: 'hard', icon: '🎯' },
  { id: 'mcts', name: 'Monte Carlo Tree Search', category: 'reinforcement', description: 'Tree search algorithm', zynxScenario: 'เมื่อ Deeja ต้องวางแผนการสนทนาหลายขั้นตอนเพื่อให้ถึงเป้าหมายที่ผู้ใช้ต้องการ', difficulty: 'hard', icon: '🎯' },

  // 🧠 Symbolic Reasoning
  { id: 'cbr', name: 'Case-Based Reasoning', category: 'symbolic', description: 'Reasoning using past cases', zynxScenario: 'Zynx Memory System จดจำปัญหาที่เจอมาแล้วและนำมาใช้แก้ปัญหาใหม่ที่คล้ายกัน', difficulty: 'medium', icon: '🧠' },
  { id: 'ilp', name: 'Inductive Logic Programming', category: 'symbolic', description: 'Learning logical rules', zynxScenario: 'ระบบ Ethics Framework เรียนรู้กฎจริยธรรมจากตัวอย่างการตัดสินใจที่ผ่านมา', difficulty: 'hard', icon: '🧠' },
  { id: 'bayesian-networks', name: 'Bayesian Networks', category: 'symbolic', description: 'Probabilistic graphical models', zynxScenario: 'การวิเคราะห์ความเชื่อมโยงระหว่างอารมณ์ วัฒนธรรม และการตอบสนองใน Context Engine', difficulty: 'medium', icon: '🧠' },
  { id: 'rule-policy', name: 'Rule-based Policy Engine', category: 'symbolic', description: 'Decision making with rules', zynxScenario: 'Compliance Engine ของ Zynx ตรวจสอบว่าการตอบสนองของ AI เป็นไปตามนโยบายองค์กร', difficulty: 'easy', icon: '🧠' },

  // 📈 Supervised Learning
  { id: 'random-forest', name: 'Random Forest', category: 'supervised', description: 'Ensemble of decision trees', zynxScenario: 'การจำแนกประเภทอารมณ์ของผู้ใช้จากข้อความใน Emotional Context Module', difficulty: 'medium', icon: '📈' },
  { id: 'xgboost', name: 'XGBoost', category: 'supervised', description: 'Gradient boosting framework', zynxScenario: 'การประมาณคะแนนความพึงพอใจของผู้ใช้จากการสนทนาเพื่อปรับปรุง Deeja', difficulty: 'medium', icon: '📈' },
  { id: 'svm', name: 'Support Vector Machine', category: 'supervised', description: 'Maximum margin classifier', zynxScenario: 'การแยกแยะคำถามที่ต้องการคำตอบทันทีกับคำถามที่ต้องการการวิเคราะห์เชิงลึก', difficulty: 'medium', icon: '📈' },
  { id: 'naive-bayes', name: 'Naive Bayes', category: 'supervised', description: 'Probabilistic classifier', zynxScenario: 'การจำแนกประเภทเอกสารที่ upload เข้า Zynx PDF Master', difficulty: 'easy', icon: '📈' },
  { id: 'knn', name: 'K-Nearest Neighbors', category: 'supervised', description: 'Instance-based learning', zynxScenario: 'การหาผู้ใช้ที่มีลักษณะคล้ายกันในระบบ Persona Engine', difficulty: 'easy', icon: '📈' },

  // 🗣️ NLP / Translation
  { id: 'transformer', name: 'Transformer (GPT-4)', category: 'nlp', description: 'Attention-based neural network', zynxScenario: 'แกนหลักของ Deeja ในการทำความเข้าใจและตอบสนองการสนทนา', difficulty: 'hard', icon: '🗣️' },
  { id: 'bart', name: 'BART Summarization', category: 'nlp', description: 'Text summarization model', zynxScenario: 'การสรุปเอกสารยาวใน PDF Master เป็นจุดสำคัญสำหรับผู้บริหาร', difficulty: 'medium', icon: '🗣️' },
  { id: 'marianmt', name: 'MarianMT Translation', category: 'nlp', description: 'Neural machine translation', zynxScenario: 'Context-Aware Translator แปลภาษาไทย-อังกฤษพร้อมปรับวัฒนธรรม', difficulty: 'medium', icon: '🗣️' },
  { id: 'whisper', name: 'Whisper ASR', category: 'nlp', description: 'Automatic speech recognition', zynxScenario: 'การแปลงเสียงผู้ใช้เป็นข้อความสำหรับ Voice Chat กับ Deeja', difficulty: 'medium', icon: '🗣️' },
  { id: 'bert', name: 'BERT', category: 'nlp', description: 'Bidirectional encoder representations', zynxScenario: 'การทำความเข้าใจบริบทและความหมายลึกในการสนทนาของ Deeja', difficulty: 'hard', icon: '🗣️' },

  // 🧬 Bio-AI / Edge AI / Compliance
  { id: 'federated-learning', name: 'Federated Learning', category: 'bio-edge', description: 'Decentralized machine learning', zynxScenario: 'การเรียนรู้จากข้อมูลผู้ใช้หลายองค์กรโดยไม่ต้องแชร์ข้อมูลส่วนตัว', difficulty: 'hard', icon: '🧬' },
  { id: 'opa', name: 'Open Policy Agent', category: 'bio-edge', description: 'Policy engine for compliance', zynxScenario: 'การบังคับใช้นโยบายความปลอดภัยและการปฏิบัติตามกฎหมายใน Zynx Enterprise', difficulty: 'medium', icon: '🧬' },
  { id: 'prometheus', name: 'Prometheus + Grafana', category: 'bio-edge', description: 'Monitoring and observability', zynxScenario: 'การติดตามประสิทธิภาพและการใช้งาน Zynx แบบ real-time', difficulty: 'medium', icon: '🧬' },
  { id: 'kubernetes-hpa', name: 'Kubernetes HPA', category: 'bio-edge', description: 'Horizontal pod autoscaling', zynxScenario: 'การปรับขนาด Zynx Context Engine อัตโนมัติตามจำนวนผู้ใช้', difficulty: 'medium', icon: '🧬' },
  { id: 'edge-optimization', name: 'Edge AI Optimization', category: 'bio-edge', description: 'Optimizing AI for edge devices', zynxScenario: 'การรัน Deeja บนอุปกรณ์มือถือโดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต', difficulty: 'hard', icon: '🧬' },
];

const categories = [
  { id: 'all', name: 'ทั้งหมด', icon: Brain, color: 'default' },
  { id: 'reinforcement', name: 'Reinforcement Learning', icon: Target, color: 'destructive' },
  { id: 'symbolic', name: 'Symbolic Reasoning', icon: Brain, color: 'secondary' },
  { id: 'supervised', name: 'Supervised Learning', icon: BookOpen, color: 'default' },
  { id: 'nlp', name: 'NLP / Translation', icon: MessageSquare, color: 'outline' },
  { id: 'bio-edge', name: 'Bio-AI / Edge AI / Compliance', icon: Dna, color: 'destructive' },
];

const scenarios = [
  "Deeja กำลังสนทนากับผู้ใช้ที่หงุดหงิดเรื่องงาน คุณจะใช้อัลกอริทึมไหนให้ Deeja เข้าใจอารมณ์และตอบสนองที่เหมาะสม?",
  "Zynx Context Engine ต้องการจดจำบุคลิกของผู้ใช้แต่ละคน คุณจะใช้วิธีไหนในการเก็บและวิเคราะห์ข้อมูลนี้?",
  "PDF Master ต้องแปลเอกสารทางการแพทย์จากไทยเป็นอังกฤษโดยคงความหมายไว้ คุณจะเลือกอัลกอริทึมไหน?",
  "ระบบ Zynx ต้องการปรับปรุงการตอบสนองจากการ feedback ของผู้ใช้ คุณจะใช้เทคนิคการเรียนรู้แบบไหน?",
  "Compliance Engine ต้องตรวจสอบว่าการตอบของ AI เป็นไปตามกฎหมายไซเบอร์ไทย อัลกอริทึมไหนเหมาะสม?",
];

export default function AlgorithmGame() {
  const { user } = useAuth();
  const {
    currentPlayer,
    currentSession,
    leaderboards,
    topPlayers,
    zoneChampions,
    championshipEnabled,
    loading: gameDataLoading,
    initializePlayer,
    initializeSession,
    updateSession
  } = useGameData();

  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    currentStreak: 0,
    bestStreak: 0,
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentScenario, setCurrentScenario] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameMode, setGameMode] = useState<'study' | 'quiz' | 'leaderboard'>('study');

  const filteredAlgorithms = selectedCategory === 'all' 
    ? algorithms 
    : algorithms.filter(algo => algo.category === selectedCategory);

  const generateNewScenario = () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    setSelectedAlgorithm(null);
    setShowResult(false);
  };

  const handleAlgorithmSelect = async (algorithmId: string) => {
    if (gameMode === 'study') {
      setSelectedAlgorithm(algorithmId);
      return;
    }

    // Quiz mode
    setSelectedAlgorithm(algorithmId);
    
    // Simple scoring logic - in real implementation, this would be more sophisticated
    const algorithm = algorithms.find(a => a.id === algorithmId);
    const scenarioKeywords = currentScenario.toLowerCase();
    let correct = false;

    // Basic matching logic for demo
    if (scenarioKeywords.includes('อารมณ์') && algorithm?.category === 'supervised') correct = true;
    if (scenarioKeywords.includes('จดจำ') && algorithm?.category === 'symbolic') correct = true;
    if (scenarioKeywords.includes('แปล') && algorithm?.category === 'nlp') correct = true;
    if (scenarioKeywords.includes('feedback') && algorithm?.category === 'reinforcement') correct = true;
    if (scenarioKeywords.includes('กฎหมาย') && algorithm?.category === 'bio-edge') correct = true;

    setIsCorrect(correct);
    setShowResult(true);
    
    const newStats = {
      ...gameStats,
      totalQuestions: gameStats.totalQuestions + 1,
      correctAnswers: gameStats.correctAnswers + (correct ? 1 : 0),
      score: gameStats.score + (correct ? 10 : 0),
      currentStreak: correct ? gameStats.currentStreak + 1 : 0,
      bestStreak: correct ? Math.max(gameStats.bestStreak, gameStats.currentStreak + 1) : gameStats.bestStreak,
    };
    
    setGameStats(newStats);

    // Update database session if player is set up
    if (currentSession && algorithm) {
      await updateSession(
        correct,
        algorithm.category,
        newStats.currentStreak,
        newStats.totalQuestions,
        newStats.correctAnswers
      );
    }
  };

  const handlePlayerSetup = async (displayName: string, isAi: boolean, aiDescription?: string) => {
    const player = await initializePlayer(displayName, isAi, aiDescription);
    if (player) {
      await initializeSession();
    }
  };

  useEffect(() => {
    generateNewScenario();
  }, []);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || Brain;
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'reinforcement': return 'bg-red-500';
      case 'symbolic': return 'bg-purple-500';
      case 'supervised': return 'bg-blue-500';
      case 'nlp': return 'bg-green-500';
      case 'bio-edge': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          🧠 Zynx Algorithm Game
        </h1>
        <p className="text-lg text-muted-foreground">
          เรียนรู้อัลกอริทึม AI ผ่านสถานการณ์จริงใน Zynx CaaS Platform
        </p>
      </div>

      {/* Game Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            สถิติการเล่น
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{gameStats.score}</div>
              <div className="text-sm text-muted-foreground">คะแนน</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{gameStats.correctAnswers}/{gameStats.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">ถูก/ทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gameStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">ต่อเนื่อง</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{gameStats.bestStreak}</div>
              <div className="text-sm text-muted-foreground">สูงสุด</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {gameStats.totalQuestions > 0 ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">ความแม่นยำ</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show player setup if not authenticated or no current player */}
      {!user ? (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>เข้าสู่ระบบเพื่อเล่นเกม</CardTitle>
            <CardDescription>
              กรุณาเข้าสู่ระบบเพื่อบันทึกคะแนนและเข้าร่วมการแข่งขัน
            </CardDescription>
          </CardHeader>
        </Card>
      ) : !currentPlayer ? (
        <PlayerSetup onPlayerCreated={handlePlayerSetup} loading={gameDataLoading} />
      ) : (
        <>
          {/* Game Mode Selector */}
          <Tabs value={gameMode} onValueChange={(value) => setGameMode(value as 'study' | 'quiz' | 'leaderboard')} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="study">โหมดศึกษา</TabsTrigger>
              <TabsTrigger value="quiz">โหมดทดสอบ</TabsTrigger>
              <TabsTrigger value="leaderboard">
                <Crown className="h-4 w-4 mr-2" />
                อันดับ
              </TabsTrigger>
            </TabsList>

        <TabsContent value="study" className="space-y-6">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle>เลือกหมวดหมู่อัลกอริทึม</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Algorithms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlgorithms.map((algorithm) => (
              <Card 
                key={algorithm.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedAlgorithm === algorithm.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleAlgorithmSelect(algorithm.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{algorithm.icon}</span>
                      {algorithm.name}
                    </CardTitle>
                    <Badge variant={algorithm.difficulty === 'easy' ? 'default' : algorithm.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                      {algorithm.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{algorithm.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`h-1 w-full rounded ${getCategoryColor(algorithm.category)}`} />
                    <p className="text-sm text-muted-foreground font-medium">🎯 สถานการณ์ใน Zynx:</p>
                    <p className="text-sm">{algorithm.zynxScenario}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          {/* Quiz Scenario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🎯 สถานการณ์จำลอง
                <Button onClick={generateNewScenario} variant="outline" size="sm">
                  <Shuffle className="h-4 w-4 mr-2" />
                  สถานการณ์ใหม่
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{currentScenario}</p>
              {showResult && (
                <div className={`mt-4 p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                    <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'ถูกต้อง! 🎉' : 'ลองใหม่ครั้งหน้า! 💪'}
                    </span>
                  </div>
                  {selectedAlgorithm && (
                    <p className="mt-2 text-sm">
                      คุณเลือก: <strong>{algorithms.find(a => a.id === selectedAlgorithm)?.name}</strong>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Algorithm Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {algorithms.map((algorithm) => (
              <Button
                key={algorithm.id}
                variant={selectedAlgorithm === algorithm.id ? "default" : "outline"}
                onClick={() => handleAlgorithmSelect(algorithm.id)}
                disabled={showResult}
                className="h-auto p-4 text-left flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">{algorithm.icon}</span>
                  <span className="font-semibold text-sm">{algorithm.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {categories.find(c => c.id === algorithm.category)?.name}
                </Badge>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Leaderboard 
            topPlayers={topPlayers}
            zoneChampions={zoneChampions}
            championshipEnabled={championshipEnabled}
          />
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}