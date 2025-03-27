
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, BookOpen, FileText, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockRoadmap } from '@/lib/mockData';

// Create explanations for checklist items
const explanations = {
  // Validation Phase
  "Conduct market research & customer interviews": {
    title: "Market Research & Customer Interviews",
    description: "Understanding your market and potential customers is the foundation of a successful startup.",
    content: `
      <h3 class="text-xl font-semibold mb-4">Why This Matters</h3>
      <p class="mb-4">Before building anything, you need to validate that your solution addresses a real problem people are willing to pay for. Market research and customer interviews help you understand your target audience's pain points, needs, and preferences.</p>
      
      <h3 class="text-xl font-semibold mb-4">How To Do It Right</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Start with secondary research: industry reports, competitor analysis, and market size estimates</li>
        <li>Identify 15-20 potential customers who fit your target demographic</li>
        <li>Prepare open-ended questions that focus on understanding problems, not selling solutions</li>
        <li>Listen more than you talk during interviews</li>
        <li>Look for patterns across multiple interviews</li>
        <li>Be willing to pivot based on feedback</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Common Pitfalls</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Talking only to friends and family who might be biased</li>
        <li>Asking leading questions that confirm your existing beliefs</li>
        <li>Focusing too much on features instead of problems</li>
        <li>Ignoring negative feedback</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Resources</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>"The Mom Test" by Rob Fitzpatrick - A guide to customer conversations</li>
        <li>Google Trends - For analyzing search interest over time</li>
        <li>SurveyMonkey or Typeform - For creating surveys</li>
        <li>Statista and IBISWorld - For market research reports</li>
      </ul>
    `,
    icon: <FileText className="h-6 w-6" />
  },
  "Build MVP (Minimum Viable Product)": {
    title: "Building Your MVP",
    description: "The art of creating the simplest version of your product that solves the core problem.",
    content: `
      <h3 class="text-xl font-semibold mb-4">Why This Matters</h3>
      <p class="mb-4">An MVP allows you to validate your core concept with real users while minimizing development time and resources. It's about learning, not perfection.</p>
      
      <h3 class="text-xl font-semibold mb-4">How To Do It Right</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Focus only on features that solve the core problem</li>
        <li>Remove everything that's "nice to have" but not essential</li>
        <li>Consider non-scalable manual solutions before building complex automation</li>
        <li>Set clear success metrics before you launch</li>
        <li>Plan for quick iterations based on user feedback</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Common Pitfalls</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Feature creep - adding "just one more thing" before launch</li>
        <li>Perfectionism - waiting too long to release because it's not perfect</li>
        <li>Building in a vacuum without continuous user feedback</li>
        <li>Choosing technologies based on trends rather than appropriate fit</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Resources</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>"Lean Startup" by Eric Ries - The fundamental guide to MVP thinking</li>
        <li>Figma/Sketch - For prototyping interfaces before coding</li>
        <li>No-code tools like Bubble or Webflow - For building MVPs without deep technical skills</li>
        <li>UserTesting.com - For getting quick feedback on your MVP</li>
      </ul>
    `,
    icon: <Lightbulb className="h-6 w-6" />
  },
  "Launch beta testing with 10-20 early users": {
    title: "Beta Testing Strategy",
    description: "Getting your product into the hands of early users who can provide valuable feedback.",
    content: `
      <h3 class="text-xl font-semibold mb-4">Why This Matters</h3>
      <p class="mb-4">Beta testing gives you real-world feedback before a wider launch. Early users can identify bugs, usability issues, and feature gaps while helping you refine your value proposition.</p>
      
      <h3 class="text-xl font-semibold mb-4">How To Do It Right</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Select beta users who match your target audience but are willing to tolerate imperfections</li>
        <li>Clearly communicate that this is a beta version and set expectations</li>
        <li>Create a structured feedback process (surveys, interviews, usage analytics)</li>
        <li>Prioritize fixing critical issues before adding new features</li>
        <li>Maintain regular communication with beta users</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Common Pitfalls</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Choosing beta users who are too nice to give critical feedback</li>
        <li>Not providing clear ways for users to report issues</li>
        <li>Ignoring qualitative feedback in favor of just quantitative metrics</li>
        <li>Extending the beta period too long without moving forward</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Resources</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>BetaList - Platform to find early adopters</li>
        <li>Intercom or Zendesk - For managing user communications</li>
        <li>Hotjar - For user behavior analytics</li>
        <li>Trello or Asana - For organizing feedback and prioritizing fixes</li>
      </ul>
    `,
    icon: <BookOpen className="h-6 w-6" />
  },
  // Add more explanations for other checklist items...
  "Define core metrics to track success": {
    title: "Defining Success Metrics",
    description: "Establishing the key performance indicators that will guide your startup's growth.",
    content: `
      <h3 class="text-xl font-semibold mb-4">Why This Matters</h3>
      <p class="mb-4">Without clear metrics, you can't objectively measure progress or make data-driven decisions. Good metrics help align your team, focus efforts, and demonstrate traction to investors.</p>
      
      <h3 class="text-xl font-semibold mb-4">How To Do It Right</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Focus on a small set of metrics (3-5) that truly indicate business health</li>
        <li>Choose both leading indicators (predict future success) and lagging indicators (show past performance)</li>
        <li>Ensure metrics align with your current business stage</li>
        <li>Set up proper tracking systems before you need the data</li>
        <li>Review metrics regularly and adjust strategies accordingly</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Common Pitfalls</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Tracking vanity metrics that look good but don't indicate real business health</li>
        <li>Setting too many metrics, creating analysis paralysis</li>
        <li>Not having a clear baseline or goal for each metric</li>
        <li>Changing metrics too frequently, making it impossible to track progress</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-4">Resources</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>"Lean Analytics" by Alistair Croll and Benjamin Yoskovitz</li>
        <li>Google Analytics or Mixpanel - For tracking user behavior</li>
        <li>ChartMogul or Baremetrics - For subscription metrics</li>
        <li>Databox or Geckoboard - For creating metric dashboards</li>
      </ul>
    `,
    icon: <AlertTriangle className="h-6 w-6" />
  },
};

const ChecklistItemDetail = () => {
  const { phaseIndex, stepIndex, itemTitle } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState<any>(null);
  
  useEffect(() => {
    // If we have an itemTitle, look it up in our explanations
    if (itemTitle && explanations[itemTitle as keyof typeof explanations]) {
      setItemData(explanations[itemTitle as keyof typeof explanations]);
    } else if (phaseIndex !== undefined && stepIndex !== undefined) {
      // If we have phaseIndex and stepIndex, look up the item title
      const roadmap = mockRoadmap.tech;
      const phase = roadmap.phases[parseInt(phaseIndex)];
      if (phase && phase.steps[parseInt(stepIndex)]) {
        const title = phase.steps[parseInt(stepIndex)].title;
        if (explanations[title as keyof typeof explanations]) {
          setItemData(explanations[title as keyof typeof explanations]);
        }
      }
    }
  }, [phaseIndex, stepIndex, itemTitle]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Roadmap
          </Button>
          
          {itemData ? (
            <Card className="glass-panel border-none shadow-lg animate-scale-in max-w-4xl mx-auto">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    {itemData.icon || <Lightbulb className="h-6 w-6" />}
                  </div>
                  <div>
                    <CardTitle>{itemData.title}</CardTitle>
                    <CardDescription className="mt-1">{itemData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: itemData.content }}></div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Item information not found</h2>
              <p className="text-muted-foreground">The requested item explanation is not available.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChecklistItemDetail;
