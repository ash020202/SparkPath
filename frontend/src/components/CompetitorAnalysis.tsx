
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { mockCompetitors } from '@/lib/mockData';

const CompetitorAnalysis = () => {
  const [activeCompetitor, setActiveCompetitor] = useState('0');
  
  return (
    <Card className="glass-panel border-none shadow-lg animate-scale-in overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" /> 
          Competitor SWOT Analysis
        </CardTitle>
        <CardDescription>
          Evaluate your competition's strengths, weaknesses, opportunities, and threats
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="0" value={activeCompetitor} onValueChange={setActiveCompetitor} className="w-full">
        <TabsList className="w-full border-b rounded-none h-auto py-0 bg-transparent">
          {mockCompetitors.map((competitor, index) => (
            <TabsTrigger 
              key={index} 
              value={index.toString()}
              className="flex-1 data-[state=active]:bg-secondary rounded-none border-r last:border-r-0 h-14"
            >
              <span className="text-sm font-medium">{competitor.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {mockCompetitors.map((competitor, index) => (
          <TabsContent 
            key={index} 
            value={index.toString()}
            className="pt-6 px-6 pb-8 animate-fade-in"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {competitor.swot.strengths.map((strength, sIndex) => (
                    <li key={sIndex} className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-sm flex items-start">
                      <ChevronRight className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0 mt-0.5 mr-2" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center text-red-600 dark:text-red-400">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  Weaknesses
                </h3>
                <ul className="space-y-2">
                  {competitor.swot.weaknesses.map((weakness, wIndex) => (
                    <li key={wIndex} className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-sm flex items-start">
                      <ChevronRight className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5 mr-2" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Opportunities
                </h3>
                <ul className="space-y-2">
                  {competitor.swot.opportunities.map((opportunity, oIndex) => (
                    <li key={oIndex} className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm flex items-start">
                      <ChevronRight className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5 mr-2" />
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center text-amber-600 dark:text-amber-400">
                  <Search className="h-4 w-4 mr-2" />
                  Threats
                </h3>
                <ul className="space-y-2">
                  {competitor.swot.threats.map((threat, tIndex) => (
                    <li key={tIndex} className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg text-sm flex items-start">
                      <ChevronRight className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5 mr-2" />
                      <span>{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default CompetitorAnalysis;
