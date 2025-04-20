
import { Shield, Clock, Zap, ChartBar } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Advanced Protection",
    description: "Our AI-powered system continuously monitors for suspicious transaction patterns with industry-leading accuracy."
  },
  {
    icon: Clock,
    title: "Real-Time Detection",
    description: "Detect and prevent fraud in real-time, before it impacts your business or customers."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Our optimized algorithms process transactions in milliseconds, providing immediate fraud assessment."
  },
  {
    icon: ChartBar,
    title: "Detailed Analytics",
    description: "Gain valuable insights into transaction patterns and fraud attempts with comprehensive reporting."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Intelligent Fraud Protection
          </h2>
          <p className="text-muted-foreground text-lg">
            Our system combines advanced machine learning with real-time monitoring to provide unparalleled transaction security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background rounded-2xl p-6 shadow-sm border border-border/40 transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
