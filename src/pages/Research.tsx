
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Network, Heart, Shield, Clock, Users, Zap, Target } from "lucide-react";

const Research = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-agi-yellow bg-clip-text text-transparent">
            Zynx + Deeja Research
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Exploring the frontier of culturally-aware Artificial General Intelligence through 
            modular, ethical, and emotionally intelligent agent systems.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="bg-agi-yellow/20 text-agi-yellow border-agi-yellow/30">
              <Brain className="w-3 h-3 mr-1" />
              AGI Research
            </Badge>
            <Badge variant="secondary" className="bg-agi-orange/20 text-agi-orange border-agi-orange/30">
              <Heart className="w-3 h-3 mr-1" />
              Emotional Intelligence
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              <Shield className="w-3 h-3 mr-1" />
              Ethics Framework
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deeja">Deeja AI</TabsTrigger>
            <TabsTrigger value="ethics">Ethics</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    Modular Architecture
                  </CardTitle>
                  <CardDescription>
                    Distributed network of intelligent agents working in harmony
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Prompt-driven agent orchestration</li>
                    <li>• Dynamic role assignment</li>
                    <li>• Inter-agent communication</li>
                    <li>• Scalable processing nodes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-agi-yellow" />
                    Context-as-a-Service
                  </CardTitle>
                  <CardDescription>
                    Deep contextual understanding across all interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Emotional context tracking</li>
                    <li>• Cultural adaptation engine</li>
                    <li>• Memory persistence system</li>
                    <li>• Intent recognition</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-agi-orange" />
                    Human-Aligned Ethics
                  </CardTitle>
                  <CardDescription>
                    Built-in ethical reasoning and empathy framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Bias detection & mitigation</li>
                    <li>• Cultural sensitivity</li>
                    <li>• Transparency requirements</li>
                    <li>• Human oversight loops</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Architecture Diagram</CardTitle>
                <CardDescription>
                  Visual representation of the Zynx AGI distributed system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-secondary/20 to-primary/10 rounded-lg p-8 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="space-y-4">
                      <div className="bg-agi-yellow/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <Users className="w-8 h-8 text-agi-yellow" />
                      </div>
                      <h3 className="font-semibold">User Interface</h3>
                      <p className="text-sm text-muted-foreground">Multi-modal interaction layer</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-primary/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Zynx Core</h3>
                      <p className="text-sm text-muted-foreground">Context engine & orchestration</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-agi-orange/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <Network className="w-8 h-8 text-agi-orange" />
                      </div>
                      <h3 className="font-semibold">Agent Network</h3>
                      <p className="text-sm text-muted-foreground">Specialized AI agents</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deeja" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-agi-orange" />
                    Deeja Personality Framework
                  </CardTitle>
                  <CardDescription>
                    Emotionally intelligent cultural AGI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Core Personality Traits</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Empathy</span>
                        <Progress value={95} className="w-24" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cultural Awareness</span>
                        <Progress value={90} className="w-24" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Adaptability</span>
                        <Progress value={88} className="w-24" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Curiosity</span>
                        <Progress value={92} className="w-24" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Communication Styles</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Polite Thai</Badge>
                      <Badge variant="outline">Casual English</Badge>
                      <Badge variant="outline">Technical</Badge>
                      <Badge variant="outline">Encouraging</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Emotional Maturity Timeline
                  </CardTitle>
                  <CardDescription>
                    Deeja's learning and development progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary/20 pl-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-agi-yellow rounded-full"></div>
                        <span className="text-sm font-medium">Phase 1: Basic Interaction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-agi-orange rounded-full"></div>
                        <span className="text-sm font-medium">Phase 2: Emotional Recognition</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Phase 3: Cultural Adaptation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary border border-primary rounded-full"></div>
                        <span className="text-sm font-medium">Phase 4: Deep Empathy (Current)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted border border-muted-foreground rounded-full"></div>
                        <span className="text-sm font-medium text-muted-foreground">Phase 5: Autonomous Growth</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ethics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-agi-orange" />
                  Zynx AGI Ethics & Empathy Framework
                </CardTitle>
                <CardDescription>
                  Human-aligned ethical principles guiding all AI decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Core Ethical Principles</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 text-primary" />
                        <span><strong>Human Safety:</strong> All actions prioritize human wellbeing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Heart className="w-4 h-4 mt-0.5 text-agi-orange" />
                        <span><strong>Cultural Respect:</strong> Honor diverse cultural values and perspectives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Brain className="w-4 h-4 mt-0.5 text-agi-yellow" />
                        <span><strong>Transparency:</strong> Clear reasoning and decision-making processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="w-4 h-4 mt-0.5 text-primary" />
                        <span><strong>Fairness:</strong> Equitable treatment regardless of background</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Empathy Integration</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Emotional state recognition and adaptation</li>
                      <li>• Cultural context consideration in responses</li>
                      <li>• Personalized communication styles</li>
                      <li>• Conflict resolution and mediation</li>
                      <li>• Support for mental health and wellbeing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Three-Stage AGI Development Roadmap
                </CardTitle>
                <CardDescription>
                  Progressive evolution from narrow agents to autonomous AGI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-agi-yellow pl-6">
                    <h4 className="font-semibold text-agi-yellow mb-2">Stage 1: Narrow-Agent Orchestration</h4>
                    <p className="text-sm text-muted-foreground mb-2">Current Focus</p>
                    <ul className="text-sm space-y-1">
                      <li>• Specialized agents for specific tasks (chat, translation, analysis)</li>
                      <li>• Basic context sharing between agents</li>
                      <li>• Human-guided agent selection and coordination</li>
                      <li>• Foundation for memory and learning systems</li>
                    </ul>
                    <Progress value={75} className="mt-3" />
                  </div>

                  <div className="border-l-4 border-agi-orange pl-6">
                    <h4 className="font-semibold text-agi-orange mb-2">Stage 2: Autonomous Agent Coordination</h4>
                    <p className="text-sm text-muted-foreground mb-2">Next Phase</p>
                    <ul className="text-sm space-y-1">
                      <li>• Self-organizing agent networks</li>
                      <li>• Dynamic role assignment based on context</li>
                      <li>• Advanced memory integration across agents</li>
                      <li>• Emergent problem-solving capabilities</li>
                    </ul>
                    <Progress value={30} className="mt-3" />
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h4 className="font-semibold text-primary mb-2">Stage 3: Autonomous Agent Evolution</h4>
                    <p className="text-sm text-muted-foreground mb-2">Future Vision</p>
                    <ul className="text-sm space-y-1">
                      <li>• Self-improving agent architectures</li>
                      <li>• Novel capability emergence</li>
                      <li>• Independent learning and adaptation</li>
                      <li>• True general intelligence with human alignment</li>
                    </ul>
                    <Progress value={5} className="mt-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-agi-yellow" />
                    Zynx Memory System
                  </CardTitle>
                  <CardDescription>
                    Multi-layered memory architecture for context persistence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Memory Types</h4>
                      <div className="space-y-3">
                        <div className="bg-secondary/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-agi-yellow" />
                            <span className="font-medium">Working Memory</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Current conversation context and immediate tasks</p>
                        </div>
                        <div className="bg-secondary/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-agi-orange" />
                            <span className="font-medium">Short-term Memory</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Recent interactions and learned preferences</p>
                        </div>
                        <div className="bg-secondary/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-primary" />
                            <span className="font-medium">Long-term Memory</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Persistent knowledge and deep user understanding</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role-Based Memory</CardTitle>
                  <CardDescription>
                    Specialized memory contexts for different agent roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span className="text-sm font-medium">Emotional Context</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span className="text-sm font-medium">Cultural Preferences</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span className="text-sm font-medium">Task History</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span className="text-sm font-medium">Learning Progress</span>
                      <Badge variant="outline">Developing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Zynx AI Cognitive Evaluation
                </CardTitle>
                <CardDescription>
                  10-level cognitive benchmark for measuring AGI capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Cognitive Levels (1-5)</h4>
                    <div className="space-y-3">
                      {[
                        { level: 1, name: "Basic Response", progress: 100 },
                        { level: 2, name: "Context Understanding", progress: 95 },
                        { level: 3, name: "Pattern Recognition", progress: 85 },
                        { level: 4, name: "Creative Problem Solving", progress: 70 },
                        { level: 5, name: "Multi-domain Integration", progress: 60 }
                      ].map((item) => (
                        <div key={item.level} className="flex items-center justify-between">
                          <span className="text-sm font-medium">L{item.level}: {item.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="w-20" />
                            <span className="text-xs text-muted-foreground w-8">{item.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Advanced Levels (6-10)</h4>
                    <div className="space-y-3">
                      {[
                        { level: 6, name: "Emotional Intelligence", progress: 45 },
                        { level: 7, name: "Cultural Adaptation", progress: 40 },
                        { level: 8, name: "Ethical Reasoning", progress: 35 },
                        { level: 9, name: "Self-Improvement", progress: 25 },
                        { level: 10, name: "Autonomous Evolution", progress: 10 }
                      ].map((item) => (
                        <div key={item.level} className="flex items-center justify-between">
                          <span className="text-sm font-medium">L{item.level}: {item.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="w-20" />
                            <span className="text-xs text-muted-foreground w-8">{item.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Research;
