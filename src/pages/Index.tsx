
import { ShieldCheck, AlertTriangle, Lock } from "lucide-react";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <FeaturesSection />
      
      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-primary mb-2">99.8%</p>
              <p className="text-muted-foreground">Detection Accuracy</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-primary mb-2">
                &lt;50ms
              </p>
              <p className="text-muted-foreground">Average Response Time</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-primary mb-2">
                +5M
              </p>
              <p className="text-muted-foreground">Transactions Protected</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              How Transaction Fraud Detection Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Our system uses advanced machine learning to analyze transaction patterns and detect potentially fraudulent activities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-background p-8 shadow-sm border border-border/40 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Analysis</h3>
              <p className="text-muted-foreground">
                Our system analyzes transaction data including time, amount, and 28 proprietary variables to identify suspicious patterns.
              </p>
            </div>
            
            <div className="rounded-2xl bg-background p-8 shadow-sm border border-border/40 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Each transaction is evaluated for risk based on historical patterns and known fraud indicators.
              </p>
            </div>
            
            <div className="rounded-2xl bg-background p-8 shadow-sm border border-border/40 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fraud Prevention</h3>
              <p className="text-muted-foreground">
                Suspicious transactions are flagged in real-time, allowing for immediate action to prevent fraud.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
