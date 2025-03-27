
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockMentorQA } from '@/lib/mockData';
import { Bot, User, SendIcon } from 'lucide-react';
import { booleanToString } from '@/lib/stringUtils';

const AIMentor = () => {
  const [questions] = useState(mockMentorQA);
  const [newQuestion, setNewQuestion] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the question to an API
    setNewQuestion('');
    setShowForm(false);
  };
  
  return (
    <Card className="glass-panel border-none shadow-lg animate-scale-in">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" /> 
          AI Startup Mentor
        </CardTitle>
        <CardDescription>
          Get advice from our AI startup mentor based on data from thousands of successful founders
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {questions.map((qa, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                  {qa.question}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                </Avatar>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm">
                  {qa.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showForm ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <Textarea 
              placeholder="Type your startup question here..." 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newQuestion.trim()}>
                <SendIcon className="h-4 w-4 mr-2" />
                Send Question
              </Button>
            </div>
          </form>
        ) : (
          <Button 
            onClick={() => setShowForm(true)} 
            className="w-full mt-6"
            data-show-form={booleanToString(showForm)}
          >
            Ask a Question
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMentor;
