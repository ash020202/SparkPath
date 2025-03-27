
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Clock, DollarSign, FileText, ListChecks, BookOpen, Link2, FileQuestion } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockLegalChecklist, mockLegalDetails } from '@/lib/mockData';

type LegalDetailDataType = {
  title: string;
  what: string;
  why: string;
  how: string[];
  timeline: string;
  cost: string;
  resources: { title: string; url: string }[];
  documents: string[];
};

const LegalChecklistItemDetail = () => {
  const { itemTitle } = useParams<{ itemTitle: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('what');
  const [item, setItem] = useState<LegalDetailDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemTitle) return;
    
    // Find the item in mockLegalChecklist
    const decodedTitle = decodeURIComponent(itemTitle);
    const foundItem = mockLegalChecklist.find(item => item.title === decodedTitle);
    
    if (foundItem) {
      // Get the detailed info from mockLegalDetails
      const detailedInfo = mockLegalDetails.find(detail => detail.title === decodedTitle);
      
      if (detailedInfo) {
        setItem(detailedInfo);
      } else {
        // Fallback if no detailed info is found
        setItem({
          title: foundItem.title,
          what: "Detailed explanation coming soon.",
          why: "Information about importance and compliance will be added.",
          how: ["We're working on adding detailed steps."],
          timeline: "Varies",
          cost: "Varies",
          resources: [],
          documents: []
        });
      }
    }
    
    setLoading(false);
  }, [itemTitle]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center">Item not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6" 
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checklist
          </Button>
          
          <Card className="glass-panel border-none shadow-lg animate-fade-in">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  {item.title}
                </CardTitle>
              </div>
              <CardDescription className="mt-2">
                Comprehensive guidance for legal compliance
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="what" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto scrollbar-hide pb-2 px-4 sm:px-6 pt-4">
                <TabsList className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto p-1 mb-4 sm:mb-6">
                  <TabsTrigger value="what" className="py-2">
                    <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">What</span>
                  </TabsTrigger>
                  <TabsTrigger value="why" className="py-2">
                    <ListChecks className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Why</span>
                  </TabsTrigger>
                  <TabsTrigger value="how" className="py-2">
                    <FileQuestion className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">How</span>
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="py-2">
                    <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Timeline</span>
                  </TabsTrigger>
                  <TabsTrigger value="cost" className="py-2">
                    <DollarSign className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Cost</span>
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="py-2">
                    <Link2 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Resources</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <CardContent className="px-4 sm:px-6 pb-6">
                <TabsContent value="what" className="animate-fade-in mt-0">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed">{item.what}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="why" className="animate-fade-in mt-0">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed">{item.why}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="how" className="animate-fade-in mt-0">
                  <ScrollArea className="h-[300px] pr-4">
                    <ol className="space-y-4 list-decimal list-inside">
                      {item.how.map((step, index) => (
                        <li key={index} className="text-base">
                          <div className="inline-block pl-1">{step}</div>
                        </li>
                      ))}
                    </ol>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="timeline" className="animate-fade-in mt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Estimated Timeline</h3>
                  </div>
                  <p className="text-base leading-relaxed">{item.timeline}</p>
                </TabsContent>
                
                <TabsContent value="cost" className="animate-fade-in mt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Estimated Cost</h3>
                  </div>
                  <p className="text-base leading-relaxed">{item.cost}</p>
                </TabsContent>
                
                <TabsContent value="resources" className="animate-fade-in mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Helpful Resources</h3>
                      {item.resources.length > 0 ? (
                        <ul className="space-y-2">
                          {item.resources.map((resource, index) => (
                            <li key={index}>
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <Link2 className="h-4 w-4" />
                                {resource.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No resources available yet.</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Required Documents</h3>
                      {item.documents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {item.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No document requirements specified yet.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalChecklistItemDetail;
