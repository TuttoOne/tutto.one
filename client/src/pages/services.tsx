import { Layout } from "@/components/layout/Layout";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Data Audit & Knowledge Mapping",
    description:
      "We audit your existing documentation, databases, and communication channels to create a structured map of your organizational knowledge.",
    features: [
      "Audit of Files/CRMs/Software/Drives",
      "API Readiness Score",
      "Knowledge Graph Architecture",
    ],
    price: "Starts at $5k",
  },
  {
    title: "AI Agent Architecture",
    description:
      "Design and implement specific agent workflows to automate core business processes using your structured data.",
    features: [
      "Custom Agent Workflows",
      "Human-in-the-loop Design",
      "Tool Selection & Integration",
    ],
    price: "Custom Scoping",
  },
  {
    title: "Team Enablement",
    description:
      "Workshops and training to help your team understand how to write for machines and manage AI workers.",
    features: [
      "Prompt Engineering Training",
      "Documentation Standards",
      "AI Governance Frameworks",
    ],
    price: "Starts at $3k",
  },
];

export default function Services() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Preparing your organization for the automated workforce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border/60 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 flex flex-col"
            >
              <h3 className="text-xl font-serif font-bold mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed min-h-[80px]">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {service.price}
                </div>
                <Button
                  className="w-full rounded-full"
                  variant={index === 1 ? "default" : "outline"}
                >
                  Inquire
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-secondary/30 rounded-3xl p-12">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Not sure where to start?
          </h2>
          <p className="text-muted-foreground mb-8">
            Run the diagnostic in the chat interface to get a personalized
            recommendation.
          </p>
          <Button className="rounded-full px-8 py-6 text-lg" asChild>
            <a href="/">
              Run Diagnostic <ArrowRight className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
