import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Get in Touch</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <p className="text-muted-foreground text-lg leading-relaxed">
                    I'm currently accepting new clients for Q4 2024. If you're interested in structuring your business for AI, I'd love to chat.
                </p>
                
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium">Email</div>
                            <div className="text-muted-foreground text-sm">hello@danielforsthofer.com</div>
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
                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input className="w-full px-3 py-2 border border-border rounded-md bg-white" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input className="w-full px-3 py-2 border border-border rounded-md bg-white" placeholder="jane@company.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <textarea className="w-full px-3 py-2 border border-border rounded-md bg-white min-h-[120px]" placeholder="Tell me about your project..." />
                    </div>
                    <Button className="w-full rounded-full">Send Message</Button>
                </form>
            </div>
        </div>
      </div>
    </Layout>
  );
}
