import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { copy, useT } from "@/lib/i18n";
import { Mail, Calendar, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function Contact() {
  const t = useT();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
        <h1 className="text-4xl font-serif font-bold mb-8">{t(copy.contact.title)}</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              We're currently accepting new clients for 2026. If you're
              interested in structuring your business for AI &/ Automation, we'd love to chat.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground text-sm">
                    daniel (AT) tutto.one
                  </div>
                </div>
              </div>

              <a
                href="https://cal.com/tuttoone/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    Calendar
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {t(copy.contact.bookSub)}
                  </div>
                </div>
              </a>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{t(copy.contact.location)}</div>
                  <div className="text-muted-foreground text-sm">
                    {t(copy.contact.locationValue)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t(copy.contact.sent)}</h3>
                <p className="text-muted-foreground">
                  {t(copy.contact.sentBody)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t(copy.contact.fieldName)}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t(copy.contact.phName)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t(copy.contact.fieldEmail)}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t(copy.contact.phEmail)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t(copy.contact.fieldMessage)}
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t(copy.contact.phMessage)}
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
                      {t(copy.contact.sending)}
                    </>
                  ) : (
                    t(copy.contact.submit)
                  )}
                </Button>
                {submitContact.isError && (
                  <p className="text-sm text-destructive text-center">
                    {t(copy.contact.sendError)}
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
