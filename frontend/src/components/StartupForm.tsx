import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Building, DollarSign, Users, BarChart, Lightbulb, Target, Zap, TrendingUp, LineChart, Globe, MapPin } from 'lucide-react';
import { useFormContext } from '@/context/FormContext';
import { industries, budgetRanges, teamSizes, marketSizes } from '@/lib/mockData';

// Sample data for countries and regions
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'sg', label: 'Singapore' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
];

// Regions will be dynamically populated based on the selected country
const regionsByCountry: Record<string, Array<{ value: string; label: string }>> = {
  us: [
    { value: 'northeast', label: 'Northeast' },
    { value: 'midwest', label: 'Midwest' },
    { value: 'south', label: 'South' },
    { value: 'west', label: 'West' },
  ],
  uk: [
    { value: 'england', label: 'England' },
    { value: 'scotland', label: 'Scotland' },
    { value: 'wales', label: 'Wales' },
    { value: 'northern-ireland', label: 'Northern Ireland' },
  ],
  ca: [
    { value: 'ontario', label: 'Ontario' },
    { value: 'quebec', label: 'Quebec' },
    { value: 'british-columbia', label: 'British Columbia' },
    { value: 'alberta', label: 'Alberta' },
  ],
  au: [
    { value: 'nsw', label: 'New South Wales' },
    { value: 'vic', label: 'Victoria' },
    { value: 'qld', label: 'Queensland' },
    { value: 'wa', label: 'Western Australia' },
  ],
  de: [
    { value: 'bayern', label: 'Bavaria' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'hessen', label: 'Hesse' },
  ],
  fr: [
    { value: 'ile-de-france', label: 'Île-de-France' },
    { value: 'provence', label: 'Provence-Alpes-Côte d\'Azur' },
    { value: 'aquitaine', label: 'Nouvelle-Aquitaine' },
    { value: 'auvergne', label: 'Auvergne-Rhône-Alpes' },
  ],
  jp: [
    { value: 'kanto', label: 'Kanto' },
    { value: 'kansai', label: 'Kansai' },
    { value: 'chubu', label: 'Chubu' },
    { value: 'hokkaido', label: 'Hokkaido' },
  ],
  sg: [
    { value: 'central', label: 'Central Region' },
    { value: 'east', label: 'East Region' },
    { value: 'north', label: 'North Region' },
    { value: 'west', label: 'West Region' },
  ],
  in: [
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Maharashtra' },
    { value: 'bangalore', label: 'Karnataka' },
    { value: 'hyderabad', label: 'Telangana' },
    { value: 'chennai', label: 'Tamil Nadu' },
    { value: 'kolkata', label: 'West Bengal' },
    { value: 'ahmedabad', label: 'Gujarat' },
    { value: 'lucknow', label: 'Uttar Pradesh' },
    { value: 'jaipur', label: 'Rajasthan' },
    { value: 'chandigarh', label: 'Punjab' },
    { value: 'bhopal', label: 'Madhya Pradesh' },
    { value: 'patna', label: 'Bihar' },
    { value: 'guwahati', label: 'Assam' },
    { value: 'bhubaneswar', label: 'Odisha' },
    { value: 'thiruvananthapuram', label: 'Kerala' },
    { value: 'raipur', label: 'Chhattisgarh' },
    { value: 'ranchi', label: 'Jharkhand' },
    { value: 'dehradun', label: 'Uttarakhand' },
    { value: 'shimla', label: 'Himachal Pradesh' },
    { value: 'srinagar', label: 'Jammu & Kashmir' },
    { value: 'gangtok', label: 'Sikkim' },
    { value: 'aizawl', label: 'Mizoram' },
    { value: 'kohima', label: 'Nagaland' },
    { value: 'shillong', label: 'Meghalaya' },
    { value: 'agartala', label: 'Tripura' },
    { value: 'itanagar', label: 'Arunachal Pradesh' },
    { value: 'panaji', label: 'Goa' },
    { value: 'silvassa', label: 'Dadra & Nagar Haveli' },
    { value: 'daman', label: 'Daman & Diu' },
    { value: 'kavaratti', label: 'Lakshadweep' },
    { value: 'port-blair', label: 'Andaman & Nicobar Islands' },
    { value: 'puducherry', label: 'Puducherry' },
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'ladakh', label: 'Ladakh' },
  ],
  br: [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'minas-gerais', label: 'Minas Gerais' },
    { value: 'bahia', label: 'Bahia' },
  ],
};

const StartupForm = () => {
  const { formData, updateFormData, isFormComplete } = useFormContext();
  const [activeTab, setActiveTab] = useState('basics');
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/roadmap-result');
  };
  
  const handleNext = () => {
    if (activeTab === 'basics') setActiveTab('details');
    else if (activeTab === 'details') setActiveTab('strategy');
  };
  
  const handleBack = () => {
    if (activeTab === 'strategy') setActiveTab('details');
    else if (activeTab === 'details') setActiveTab('basics');
  };

  const getRegionsForCountry = (countryCode: string) => {
    return regionsByCountry[countryCode] || [];
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-panel border-none shadow-lg animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl">Your Startup Profile</CardTitle>
          <CardDescription>
            Tell us about your startup to generate a personalized roadmap and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full mb-8">
                <TabsTrigger value="basics" className="flex-1">
                  <Building className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Startup Basics</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="flex-1">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Product Details</span>
                </TabsTrigger>
                <TabsTrigger value="strategy" className="flex-1">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Growth Strategy</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics" className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => updateFormData('industry', value)}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select 
                      value={formData.budget} 
                      onValueChange={(value) => updateFormData('budget', value)}
                    >
                      <SelectTrigger id="budget">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Select 
                      value={formData.teamSize} 
                      onValueChange={(value) => updateFormData('teamSize', value)}
                    >
                      <SelectTrigger id="teamSize">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketSize">Target Market Size</Label>
                    <Select 
                      value={formData.marketSize} 
                      onValueChange={(value) => updateFormData('marketSize', value)}
                    >
                      <SelectTrigger id="marketSize">
                        <SelectValue placeholder="Select market size" />
                      </SelectTrigger>
                      <SelectContent>
                        {marketSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center">
                      <Globe className="mr-1 h-4 w-4" />
                      Country
                    </Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => {
                        updateFormData('country', value);
                        // Reset region when country changes
                        updateFormData('region', '');
                      }}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region" className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Region
                    </Label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(value) => updateFormData('region', value)}
                      disabled={!formData.country}
                    >
                      <SelectTrigger id="region">
                        <SelectValue placeholder={formData.country ? "Select region" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getRegionsForCountry(formData.country).map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="button" onClick={handleNext} className="w-24">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="problemStatement">Problem Statement</Label>
                  <Textarea 
                    id="problemStatement" 
                    placeholder="What problem does your startup solve?" 
                    className="resize-none" 
                    rows={3}
                    value={formData.problemStatement}
                    onChange={(e) => updateFormData('problemStatement', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetCustomer">Target Customer</Label>
                  <Textarea 
                    id="targetCustomer" 
                    placeholder="Describe your ideal customer persona" 
                    className="resize-none" 
                    rows={3}
                    value={formData.targetCustomer}
                    onChange={(e) => updateFormData('targetCustomer', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="uniqueValueProposition">Unique Value Proposition</Label>
                  <Textarea 
                    id="uniqueValueProposition" 
                    placeholder="What makes your solution unique?" 
                    className="resize-none" 
                    rows={3}
                    value={formData.uniqueValueProposition}
                    onChange={(e) => updateFormData('uniqueValueProposition', e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack} className="w-24">
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} className="w-24">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="strategy" className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="competitors">Main Competitors</Label>
                  <Textarea 
                    id="competitors" 
                    placeholder="List your main competitors (separated by commas)" 
                    className="resize-none" 
                    rows={3}
                    value={formData.competitors}
                    onChange={(e) => updateFormData('competitors', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goToMarketStrategy">Go-to-Market Strategy</Label>
                  <Textarea 
                    id="goToMarketStrategy" 
                    placeholder="How will you reach your first customers?" 
                    className="resize-none" 
                    rows={3}
                    value={formData.goToMarketStrategy}
                    onChange={(e) => updateFormData('goToMarketStrategy', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="revenueModel">Revenue Model</Label>
                  <Textarea 
                    id="revenueModel" 
                    placeholder="How will your startup generate revenue?" 
                    className="resize-none" 
                    rows={3}
                    value={formData.revenueModel}
                    onChange={(e) => updateFormData('revenueModel', e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack} className="w-24">
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-8"
                    disabled={!isFormComplete}
                  >
                    Generate Roadmap <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupForm;
