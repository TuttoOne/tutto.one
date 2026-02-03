import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const submitContact = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(formData);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Get in Touch</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <p className="text-muted-foreground text-lg leading-relaxed">
                    We're currently accepting new clients for 2026. If you're interested in structuring your business for AI, we'd love to chat.
                </p>
                
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium">Email</div>
                            <div className="text-muted-foreground text-sm">hello@humanity.ai</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium">Calendar</div>
                            <div className="text-muted-foreground text-sm">Book a 15-min intro</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium">Location</div>
                            <div className="text-muted-foreground text-sm">San Francisco, CA (Remote Friendly)</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Name</label>
                          <input 
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" 
                            placeholder="Jane Doe" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <input 
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" 
                            placeholder="jane@company.com" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">Message</label>
                          <textarea 
                            id="message"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20" 
                            placeholder="Tell me about your project..." 
                          />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={submitContact.isPending}
                        className="w-full rounded-full"
                      >
                        {submitContact.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                      {submitContact.isError && (
                        <p className="text-sm text-destructive text-center">
                          Failed to send message. Please try again.
                        </p>
                      )}
                  </form>
                )}
            </div>
        </div>
      </div>
    </Layout>
  );
}
