import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ArrowLeft, LogOut, FileText, Layout } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { SELECTABLE_PRICES, type PriceKey } from "@/lib/pricing";
import { DEFAULT_SERVICES, type ServiceItem } from "@/lib/services-content";

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiRequest(method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Blog Editor ───────────────────────────────────────────────────────────────

interface BlogFormData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
  introCard: string;
  published: boolean;
}

const EMPTY_FORM: BlogFormData = {
  slug: "",
  title: "",
  excerpt: "",
  date: "",
  readTime: "5 min read",
  content: "",
  introCard: "",
  published: true,
};

function postToForm(post: BlogPost): BlogFormData {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    readTime: post.readTime,
    content: post.content,
    introCard: post.introCard ? JSON.stringify(JSON.parse(post.introCard), null, 2) : "",
    published: post.published,
  };
}

function BlogEditor({
  post,
  onSave,
  onCancel,
  isSaving,
}: {
  post: BlogFormData;
  onSave: (data: BlogFormData) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<BlogFormData>(post);
  const isNew = !post.slug;

  const set = (field: keyof BlogFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-serif font-bold">{isNew ? "New Post" : "Edit Post"}</h2>
        <button type="button" onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to list
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL path)</Label>
          <Input
            id="slug"
            data-testid="input-slug"
            value={form.slug}
            onChange={set("slug")}
            placeholder="my-post-title"
            required
            disabled={!isNew}
            className={!isNew ? "opacity-60" : ""}
          />
          {!isNew && <p className="text-xs text-muted-foreground">Slug cannot be changed after creation.</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            data-testid="input-date"
            value={form.date}
            onChange={set("date")}
            placeholder="Jun 5, 2026"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          data-testid="input-title"
          value={form.title}
          onChange={set("title")}
          placeholder="Post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          data-testid="input-excerpt"
          value={form.excerpt}
          onChange={set("excerpt")}
          placeholder="Short summary shown on the blog list"
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="readTime">Read time</Label>
        <Input
          id="readTime"
          data-testid="input-read-time"
          value={form.readTime}
          onChange={set("readTime")}
          placeholder="5 min read"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          data-testid="input-content"
          value={form.content}
          onChange={set("content")}
          placeholder="Write your post in Markdown..."
          rows={20}
          className="font-mono text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="introCard">Intro Card JSON (optional)</Label>
        <Textarea
          id="introCard"
          data-testid="input-intro-card"
          value={form.introCard}
          onChange={set("introCard")}
          placeholder='{"tagline": "A principle", "headline": "...", "sub": "..."}'
          rows={4}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Leave blank for standard header. JSON with tagline, headline, sub fields.</p>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="published"
          data-testid="switch-published"
          checked={form.published}
          onCheckedChange={(checked) => setForm((f) => ({ ...f, published: checked }))}
        />
        <Label htmlFor="published" className="cursor-pointer">
          {form.published ? "Published" : "Draft"}
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          data-testid="button-save"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : (isNew ? "Create Post" : "Save Changes")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function BlogSection() {
  const qc = useQueryClient();
  const [editingPost, setEditingPost] = useState<BlogFormData | null>(null);
  const [saveError, setSaveError] = useState("");

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: () => apiRequest("GET", "/api/admin/blog"),
  });

  const createMutation = useMutation({
    mutationFn: (data: BlogFormData) => {
      const payload: Record<string, unknown> = {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        readTime: data.readTime,
        content: data.content,
        published: data.published,
        introCard: data.introCard.trim() ? data.introCard.trim() : null,
      };
      return apiRequest("POST", "/api/admin/blog", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      qc.invalidateQueries({ queryKey: ["/api/blog"] });
      setEditingPost(null);
      setSaveError("");
    },
    onError: (err: Error) => setSaveError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: BlogFormData }) => {
      const payload: Record<string, unknown> = {
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        readTime: data.readTime,
        content: data.content,
        published: data.published,
        introCard: data.introCard.trim() ? data.introCard.trim() : null,
      };
      return apiRequest("PUT", `/api/admin/blog/${slug}`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      qc.invalidateQueries({ queryKey: ["/api/blog"] });
      setEditingPost(null);
      setSaveError("");
    },
    onError: (err: Error) => setSaveError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => apiRequest("DELETE", `/api/admin/blog/${slug}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      qc.invalidateQueries({ queryKey: ["/api/blog"] });
    },
  });

  const handleSave = (data: BlogFormData) => {
    setSaveError("");
    if (editingPost && editingPost.slug) {
      updateMutation.mutate({ slug: editingPost.slug, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (editingPost !== null) {
    return (
      <div>
        {saveError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {saveError}
          </div>
        )}
        <BlogEditor
          post={editingPost}
          onSave={handleSave}
          onCancel={() => { setEditingPost(null); setSaveError(""); }}
          isSaving={isSaving}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-bold">Blog Posts</h2>
        <Button
          data-testid="button-new-post"
          onClick={() => setEditingPost(EMPTY_FORM)}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Post
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {posts && posts.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-12">
          No posts yet. Create your first post.
        </p>
      )}

      {posts && posts.length > 0 && (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.slug}
              data-testid={`row-post-${post.slug}`}
              className="flex items-center justify-between gap-4 p-4 bg-card border border-border/60 rounded-xl hover:border-border transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{post.title}</span>
                  {!post.published && (
                    <span className="shrink-0 text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{post.date} · {post.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  data-testid={`button-edit-${post.slug}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPost(postToForm(post))}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      data-testid={`button-delete-${post.slug}`}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete post?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{post.title}". This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(post.slug)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Site Content Editor ────────────────────────────────────────────────────────


function ServiceEditor({
  service,
  index,
  onChange,
  onRemove,
}: {
  service: ServiceItem;
  index: number;
  onChange: (s: ServiceItem) => void;
  onRemove: () => void;
}) {
  const setField = (field: keyof ServiceItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...service, [field]: e.target.value });

  const setFeature = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = [...service.features];
    features[i] = e.target.value;
    onChange({ ...service, features });
  };

  const addFeature = () => onChange({ ...service, features: [...service.features, ""] });
  const removeFeature = (i: number) => onChange({ ...service, features: service.features.filter((_, idx) => idx !== i) });

  return (
    <div className="border border-border/60 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground uppercase">Service {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-destructive text-xs hover:underline">Remove</button>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={service.title} onChange={setField("title")} placeholder="Service name" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={service.description} onChange={setField("description")} rows={2} placeholder="Description" />
      </div>
      <div className="space-y-2">
        <Label>Price</Label>
        <select
          value={service.priceKey ?? ""}
          onChange={(e) => {
            const key = e.target.value;
            onChange(
              key
                ? { ...service, priceKey: key as PriceKey, price: undefined, priceLabel: undefined }
                : { ...service, priceKey: undefined },
            );
          }}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">No fixed price (use the label below)</option>
          {SELECTABLE_PRICES.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        {service.priceKey ? (
          <p className="text-xs text-muted-foreground">
            Shown as &ldquo;Starts at&rdquo; plus the amount, converted by the site&rsquo;s currency toggle.
            Change the amounts in <code>client/src/lib/pricing.ts</code>.
          </p>
        ) : (
          <Input
            value={service.priceLabel?.en ?? service.price ?? ""}
            onChange={(e) =>
              onChange({
                ...service,
                price: undefined,
                priceLabel: {
                  en: e.target.value,
                  fr: service.priceLabel?.fr || e.target.value,
                },
              })
            }
            placeholder="Custom scoping"
          />
        )}
      </div>
      <div className="space-y-2">
        <Label>Features</Label>
        {service.features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input value={f} onChange={setFeature(i)} placeholder={`Feature ${i + 1}`} />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)} className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="w-3 h-3 mr-1" /> Add feature
        </Button>
      </div>
    </div>
  );
}

// ── Services editor ──────────────────────────────────────────────────────────

function ServicesEditor() {
  const qc = useQueryClient();
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: servicesContent } = useQuery({
    queryKey: ["/api/admin/site-content/services"],
    queryFn: () => apiRequest("GET", "/api/admin/site-content/services"),
    retry: false,
  });

  useEffect(() => {
    if (servicesContent && !loaded) {
      try { setServices(JSON.parse(servicesContent.value)); } catch {}
      setLoaded(true);
    } else if (servicesContent === null && !loaded) {
      setLoaded(true);
    }
  }, [servicesContent, loaded]);

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/admin/site-content/services", { value: JSON.stringify(services) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/site-content/services"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-serif font-bold">Services</h3>
          <p className="text-xs text-muted-foreground">Shown on the Services page.</p>
        </div>
        <Button data-testid="button-save-services" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="sm">
          {saveMutation.isPending ? "Saving..." : saved ? "Saved!" : "Save"}
        </Button>
      </div>
      <div className="space-y-4">
        {services.map((service, i) => (
          <ServiceEditor key={i} service={service} index={i}
            onChange={(s) => setServices(services.map((sv, idx) => idx === i ? s : sv))}
            onRemove={() => setServices(services.filter((_, idx) => idx !== i))} />
        ))}
        <Button type="button" variant="outline" onClick={() => setServices([...services, { title: "", description: "", features: [] }])}>
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </Button>
      </div>
    </div>
  );
}

// ── Portfolio editor ──────────────────────────────────────────────────────────

interface PortfolioOverride {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
}

const DEFAULT_PORTFOLIO: PortfolioOverride[] = [
  { id: "pythia", name: "Pythia", tagline: "On-Premise AI · Document Intelligence", description: "A self-hosted document intelligence platform for litigation and legal review - built on NVIDIA DGX Spark hardware. Processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. No data ever leaves the device, satisfying Legal Professional Privilege by design. The same applies well beyond litigation: any legal, compliance or commercially sensitive material that has to stay on-premise, or that cannot be sent to a cloud model for AI processing.", url: "/pythia" },
  { id: "mcp-bridge-sharepoint-power-automate", name: "MCP Bridge - SharePoint & Power Automate", tagline: "Model Context Protocol · Consulting Engagement", description: "We built an MCP (Model Context Protocol) bridge that gives Claude direct access to a client's SharePoint environment and Power Automate flows. Instead of copy-pasting data into a chat, the team can ask AI to query, create, and update SharePoint records - and diagnose broken automations - through natural conversation.", url: "https://modelcontextprotocol.io" },
  { id: "entityvault", name: "EntityVault", tagline: "entityvault.tutto.one", description: "A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.", url: "https://entityvault.tutto.one" },
  { id: "ai-roi-portal", name: "AI ROI Portal", tagline: "tracker.tutto.one", description: "A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.", url: "https://tracker.tutto.one" },
];

function PortfolioEntryEditor({ entry, onChange }: { entry: PortfolioOverride; onChange: (e: PortfolioOverride) => void }) {
  const set = (field: keyof PortfolioOverride) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...entry, [field]: e.target.value });
  return (
    <div className="border border-border/60 rounded-xl p-4 space-y-3">
      <p className="text-xs font-mono text-muted-foreground uppercase">{entry.id}</p>
      <div className="space-y-2"><Label>Name</Label><Input value={entry.name} onChange={set("name")} /></div>
      <div className="space-y-2"><Label>Tagline</Label><Input value={entry.tagline} onChange={set("tagline")} /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={entry.description} onChange={set("description")} rows={3} /></div>
      <div className="space-y-2"><Label>URL</Label><Input value={entry.url} onChange={set("url")} /></div>
    </div>
  );
}

function PortfolioEditor() {
  const qc = useQueryClient();
  const [entries, setEntries] = useState<PortfolioOverride[]>(DEFAULT_PORTFOLIO);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data } = useQuery({
    queryKey: ["/api/admin/site-content/portfolio"],
    queryFn: () => apiRequest("GET", "/api/admin/site-content/portfolio"),
    retry: false,
  });

  useEffect(() => {
    if (data && !loaded) {
      try { setEntries(JSON.parse(data.value)); } catch {}
      setLoaded(true);
    } else if (data === null && !loaded) {
      setLoaded(true);
    }
  }, [data, loaded]);

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/admin/site-content/portfolio", { value: JSON.stringify(entries) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/site-content/portfolio"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-serif font-bold">Portfolio Entries</h3>
          <p className="text-xs text-muted-foreground">Edit name, tagline, description, and URL for each entry.</p>
        </div>
        <Button data-testid="button-save-portfolio" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="sm">
          {saveMutation.isPending ? "Saving..." : saved ? "Saved!" : "Save"}
        </Button>
      </div>
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <PortfolioEntryEditor key={entry.id} entry={entry}
            onChange={(e) => setEntries(entries.map((en, idx) => idx === i ? e : en))} />
        ))}
      </div>
    </div>
  );
}

// ── About editor ──────────────────────────────────────────────────────────────

interface AboutHero {
  headline: string;
  sub: string;
}

const DEFAULT_ABOUT: AboutHero = {
  headline: "Exploring AI Practically",
  sub: "Making LLM-based AI systems useful is a very hands-on experience. The technology is new; it's moving very fast and it is extremely powerful if used in the right way. This is an exploration of one step in making all of that possible. I don't pretend to have all the answers, but I trust in the process because I've seen it work over and over again - and I want to share that with you.",
};

function AboutEditor() {
  const qc = useQueryClient();
  const [hero, setHero] = useState<AboutHero>(DEFAULT_ABOUT);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data } = useQuery({
    queryKey: ["/api/admin/site-content/about-hero"],
    queryFn: () => apiRequest("GET", "/api/admin/site-content/about-hero"),
    retry: false,
  });

  useEffect(() => {
    if (data && !loaded) {
      try { setHero(JSON.parse(data.value)); } catch {}
      setLoaded(true);
    } else if (data === null && !loaded) {
      setLoaded(true);
    }
  }, [data, loaded]);

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/admin/site-content/about-hero", { value: JSON.stringify(hero) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/site-content/about-hero"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-serif font-bold">About Page Hero</h3>
          <p className="text-xs text-muted-foreground">Headline and intro text on the About page.</p>
        </div>
        <Button data-testid="button-save-about" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="sm">
          {saveMutation.isPending ? "Saving..." : saved ? "Saved!" : "Save"}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Intro text</Label>
          <Textarea value={hero.sub} onChange={(e) => setHero({ ...hero, sub: e.target.value })} rows={4} />
        </div>
      </div>
    </div>
  );
}

// ── Site Content container ────────────────────────────────────────────────────

function SiteContentSection() {
  return (
    <div className="space-y-10 divide-y divide-border/40">
      <ServicesEditor />
      <div className="pt-10"><PortfolioEditor /></div>
      <div className="pt-10"><AboutEditor /></div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const { isLoading: authLoading, isError: authError } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: () => apiRequest("GET", "/api/admin/me"),
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => {
      qc.clear();
      navigate("/admin/login");
    },
  });

  useEffect(() => {
    if (authError) {
      navigate("/admin/login");
    }
  }, [authError, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (authError) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <span className="font-serif font-bold">Tutto Admin</span>
          </div>
          <Button
            data-testid="button-logout"
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="blog">
          <TabsList data-testid="tabs-admin" className="mb-8">
            <TabsTrigger data-testid="tab-blog" value="blog">
              <FileText className="w-4 h-4 mr-2" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger data-testid="tab-content" value="content">
              <Layout className="w-4 h-4 mr-2" />
              Site Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogSection />
          </TabsContent>

          <TabsContent value="content">
            <SiteContentSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
