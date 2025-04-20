
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-50 h-[800px] w-[800px] rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 opacity-50 h-[600px] w-[600px] rounded-full bg-primary/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full mb-6 bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            <ShieldCheck className="h-4 w-4 mr-2" />
            <span>AI-Powered Fraud Detection</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl text-balance animate-fade-up [animation-delay:200ms]">
            Online Transaction Frauds Detection Using Deep Learning
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl text-balance animate-fade-up [animation-delay:400ms]">
            Our advanced AI system analyzes transaction patterns in real-time to detect and prevent fraudulent activities before they impact your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fade-up [animation-delay:600ms]">
            <Link
              to="/detector"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Try Fraud Detector
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-secondary text-foreground font-medium transition-all hover:bg-secondary/80 hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
