
import { Shield, Database, Brain, LineChart } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-up">
              About TransactionGuard
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up [animation-delay:200ms]">
              We're on a mission to make digital transactions safer for everyone. Our cutting-edge fraud detection system helps businesses identify and prevent fraudulent activities in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Our Technology
            </h2>
            <p className="text-lg text-muted-foreground">
              TransactionGuard is built on advanced AI and machine learning technologies that continuously learn and adapt to new fraud patterns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/40 flex flex-col">
              <Brain className="h-8 w-8 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">Machine Learning</h3>
              <p className="text-muted-foreground">
                Our fraud detection model uses sophisticated machine learning algorithms, including Random Forest Classifiers and neural networks, to identify suspicious transaction patterns with high accuracy.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/40 flex flex-col">
              <Database className="h-8 w-8 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">Data Processing</h3>
              <p className="text-muted-foreground">
                We process and analyze transaction data in real-time, applying standardization and principal component analysis to extract meaningful patterns and detect anomalies.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/40 flex flex-col">
              <Shield className="h-8 w-8 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">Security</h3>
              <p className="text-muted-foreground">
                Security is our top priority. All data is processed with industry-leading encryption and privacy standards, ensuring your sensitive information remains protected.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/40 flex flex-col">
              <LineChart className="h-8 w-8 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="text-muted-foreground">
                Our system provides comprehensive analytics on transaction patterns, allowing businesses to gain valuable insights and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              How Our Fraud Detection Works
            </h2>
            <p className="text-lg text-muted-foreground">
              TransactionGuard uses a multi-layered approach to detect and prevent fraudulent transactions.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border"></div>
            
            {/* Steps */}
            <div className="relative z-10">
              {/* Step 1 */}
              <div className="mb-16 flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
                  <p className="text-muted-foreground">
                    Transaction data is collected and preprocessed, including standardization of numerical features.
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-semibold">1</span>
                </div>
                <div className="flex-1 pl-8"></div>
              </div>
              
              {/* Step 2 */}
              <div className="mb-16 flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-semibold">2</span>
                </div>
                <div className="flex-1 pl-8">
                  <h3 className="text-xl font-semibold mb-2">Feature Extraction</h3>
                  <p className="text-muted-foreground">
                    Principal Component Analysis (PCA) is applied to extract the most relevant features from the data.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="mb-16 flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <h3 className="text-xl font-semibold mb-2">Model Prediction</h3>
                  <p className="text-muted-foreground">
                    Our machine learning model analyzes the processed data to determine the likelihood of fraud.
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-semibold">3</span>
                </div>
                <div className="flex-1 pl-8"></div>
              </div>
              
              {/* Step 4 */}
              <div className="flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-semibold">4</span>
                </div>
                <div className="flex-1 pl-8">
                  <h3 className="text-xl font-semibold mb-2">Decision & Action</h3>
                  <p className="text-muted-foreground">
                    Based on the prediction results, transactions are classified as legitimate or potentially fraudulent, with detailed risk assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
