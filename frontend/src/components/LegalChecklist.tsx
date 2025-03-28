
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { mockLegalChecklist } from '@/lib/mockData';

const LegalChecklist = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(mockLegalChecklist);
  
  const handleToggle = (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index] = {
      ...updatedChecklist[index],
      completed: !updatedChecklist[index].completed
    };
    setChecklist(updatedChecklist);
  };
  
  const handleItemClick = (title: string) => {
    // Encode the title for URL
    const encodedTitle = encodeURIComponent(title);
    navigate(`/legal-checklist-item/${encodedTitle}`);
  };
  
  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedCount / checklist.length) * 100);
  
  return (
    <Card className="glass-panel border-none shadow-lg animate-scale-in overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> 
          Legal & Compliance Checklist
        </CardTitle>
        <CardDescription>
          Essential legal and regulatory requirements for your startup
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Compliance Progress</h3>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {checklist.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-3">
          {checklist.map((item, index) => (
            <div 
              key={index}
              className={`flex items-start p-4 rounded-lg transition-colors ${
                item.completed ? 'bg-secondary/50' : 'hover:bg-secondary/30'
              }`}
            >
              <Checkbox 
                id={`legal-${index}`}
                checked={item.completed}
                onCheckedChange={() => handleToggle(index)}
                className="mt-0.5"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <label 
                      htmlFor={`legal-${index}`} 
                      className={`cursor-pointer font-medium ${
                        item.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {item.title}
                    </label>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-2 text-muted-foreground hover:text-foreground">
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{item.details}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-1 h-auto"
                    onClick={() => handleItemClick(item.title)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </div>
              </div>
              
           
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalChecklist;
