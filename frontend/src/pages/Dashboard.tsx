
import { FormProvider } from '@/context/FormContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StartupForm from '@/components/StartupForm';

const Dashboard = () => {
  return (
    <FormProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Startup Profile
              </span>
              <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
                Let's build your startup roadmap
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Answer a few questions about your startup and we'll generate a personalized roadmap and insights
              </p>
            </div>
            
            <StartupForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </FormProvider>
  );
};

export default Dashboard;
