"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, ImagePlus, LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { defaultContent } from "@/data/default-content";
import type { Locale, Project, SiteContent } from "@/types/site";

type Tab = "site" | "projects" | "lists" | "contact" | "seo" | "advanced";
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${Date.now()}`;
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <label className="adminField"><span>{label}</span><input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>;
}
function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <label className="adminField"><span>{label}</span><textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

export function AdminDashboard() {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [ready, setReady] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [tab, setTab] = useState<Tab>("site");
  const [locale, setLocale] = useState<Locale>("en");
  const [content, setContent] = useState<SiteContent>(clone(defaultContent));
  const [selectedProject, setSelectedProject] = useState(0);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const page = content.locales[locale];
  const project = content.projects[selectedProject];

  const updateLocale = (patch: Partial<typeof page>) => {
    setContent((current) => ({ ...current, locales: { ...current.locales, [locale]: { ...current.locales[locale], ...patch } } }));
  };
  const updateProject = (patch: Partial<Project>) => {
    setContent((current) => {
      const projects = [...current.projects];
      projects[selectedProject] = { ...projects[selectedProject], ...patch };
      return { ...current, projects };
    });
  };

  const loadContent = async () => {
    if (!supabase) return;
    setStatus("Loading content…");
    const { data, error } = await supabase.from("portfolio_site_content").select("content").eq("id", "main").maybeSingle();
    if (error) return setStatus(error.message);
    if (data?.content?.locales && data?.content?.projects) {
      setContent(data.content as SiteContent);
      setStatus("Content loaded.");
    } else {
      setContent(clone(defaultContent));
      setStatus(data?.content ? "Older CMS data detected. Current bilingual defaults are loaded; Save Changes to upgrade the CMS document." : "No CMS content found. Defaults loaded; Save Changes to publish.");
    }
  };

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    const bootstrap = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: admin } = await supabase.from("portfolio_admins").select("user_id").maybeSingle();
        if (admin) { setSessionEmail(session.user.email ?? ""); await loadContent(); }
        else { await supabase.auth.signOut(); setStatus("This account is not authorized as a portfolio admin."); }
      }
      setReady(true);
    };
    void bootstrap();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => setSessionEmail(session?.user.email ?? ""));
    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => { if (tab === "advanced") setJsonText(JSON.stringify(content, null, 2)); }, [tab, content]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setStatus("Signing in…");
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) return setStatus(error.message);
    const { data: admin } = await supabase.from("portfolio_admins").select("user_id").maybeSingle();
    if (!admin) { await supabase.auth.signOut(); return setStatus("This account is not authorized as a portfolio admin."); }
    setSessionEmail(data.user.email ?? loginEmail); setLoginPassword(""); await loadContent();
  };

  const save = async () => {
    if (!supabase) return;
    setSaving(true); setStatus("Saving…");
    const { error } = await supabase.from("portfolio_site_content").upsert({ id: "main", content, updated_at: new Date().toISOString() });
    setSaving(false); setStatus(error ? error.message : "Saved. EN and AR public pages now use the updated content.");
  };

  const logout = async () => { if (supabase) await supabase.auth.signOut(); setSessionEmail(""); };

  const addProject = () => {
    const nextIndex = String(content.projects.length + 1).padStart(2, "0");
    const newProject: Project = {
      id: `project-${Date.now()}`, index: nextIndex, accent: "green", featured: true,
      name: { en: "New Flutter Project", ar: "مشروع Flutter جديد" },
      category: { en: "Mobile Application", ar: "تطبيق جوال" },
      status: { en: "In development", ar: "قيد التطوير" },
      short: { en: "Add a short project summary.", ar: "أضف وصفاً مختصراً للمشروع." },
      description: { en: "Add the full project description.", ar: "أضف الوصف الكامل للمشروع مع توضيح دورك والتقنيات المستخدمة." },
      technologies: ["Flutter", "Dart"], highlights: { en: ["Feature"], ar: ["ميزة التطبيق"] }, images: [],
    };
    setContent((current) => ({ ...current, projects: [...current.projects, newProject] }));
    setSelectedProject(content.projects.length); setStatus("New project added locally. Complete EN/AR content and save.");
  };

  const deleteProject = () => {
    if (!project || !window.confirm(`Delete ${project.name.en}?`)) return;
    const projects = content.projects.filter((_, index) => index !== selectedProject);
    setContent({ ...content, projects }); setSelectedProject(Math.max(0, selectedProject - 1));
  };

  const uploadAsset = async (file: File, folder: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${folder}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: false });
    if (error) throw error;
    return supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
  };

  const uploadProjectImage = async (file?: File) => {
    if (!file || !project) return;
    try {
      setStatus("Uploading image…");
      const url = await uploadAsset(file, `projects/${project.id}`);
      updateProject({ images: [...project.images, { src: url, label: { en: file.name.split(".")[0], ar: file.name.split(".")[0] }, description: { en: "Project screen", ar: "Project screen" } }] });
      setStatus("Image uploaded. Save Changes to publish.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Image upload failed."); }
  };

  const uploadCv = async (file?: File) => {
    if (!file) return;
    try {
      setStatus("Uploading CV…");
      const url = await uploadAsset(file, "cv");
      setContent((current) => ({ ...current, settings: { ...current.settings, cvUrl: url } }));
      setStatus("CV uploaded. Save Changes to publish.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "CV upload failed."); }
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as SiteContent;
      if (!parsed.locales?.en || !parsed.locales?.ar || !parsed.projects || !parsed.settings) throw new Error("JSON must contain locales.en, locales.ar, projects, and settings.");
      setContent(parsed); setStatus("JSON applied locally. Click Save Changes to publish.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Invalid JSON."); }
  };

  if (!ready) return <div className="adminCenter">Loading dashboard…</div>;
  if (!supabase) return <div className="adminSetup"><div className="adminSetupCard"><span className="eyebrow">CMS setup required</span><h1>Connect Supabase to enable the dashboard.</h1><p>The public EN/AR portfolio works from built-in content. Editing and publishing needs Supabase Auth, Database, and Storage.</p><ol><li>Run <code>supabase/portfolio-cms.sql</code>.</li><li>Create your admin user.</li><li>Add the user to <code>portfolio_admins</code>.</li><li>Set Supabase URL and anon key in <code>.env.local</code>.</li></ol><a href="/en" className="ghostButton"><ArrowLeft size={16} /> Back to website</a></div></div>;
  if (!sessionEmail) return <div className="adminSetup"><form className="adminLoginCard" onSubmit={login}><span className="eyebrow">Portfolio CMS</span><h1>Admin sign in</h1><Input label="Email" value={loginEmail} onChange={setLoginEmail} type="email" /><Input label="Password" value={loginPassword} onChange={setLoginPassword} type="password" /><button className="primaryButton big" type="submit">Sign in</button>{status ? <p className="adminStatus">{status}</p> : null}<a href="/en" className="textButton"><ArrowLeft size={15} /> Back to website</a></form></div>;

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div>
          <strong>AE // CMS</strong><p className="adminEmail">{sessionEmail}</p>
          <nav className="adminNav">
            {(["site","projects","lists","contact","seo","advanced"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "site" ? "Website copy" : item === "lists" ? "Services & stack" : item === "contact" ? "Contact & media" : item.toUpperCase()}</button>)}
          </nav>
        </div>
        <div className="adminSidebarActions"><a href={`/${locale}`} target="_blank" className="ghostButton"><Eye size={15} /> Preview {locale.toUpperCase()}</a><button className="ghostButton" onClick={logout}><LogOut size={15} /> Sign out</button></div>
      </aside>

      <main className="adminMain">
        <div className="adminTopbar">
          <div><span className="eyebrow">Bilingual Portfolio CMS</span><h1>{tab === "projects" ? "Projects" : tab === "lists" ? "Lists" : tab === "contact" ? "Contact & media" : tab === "seo" ? "SEO" : tab === "advanced" ? "Advanced JSON" : "Website content"}</h1></div>
          <div className="adminTopActions">
            <div className="adminLocaleSwitch"><button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button><button className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")}>AR</button></div>
            <button className="primaryButton big" onClick={() => void save()} disabled={saving}><Save size={16} /> {saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </div>
        {status ? <div className="adminStatusBar">{status}</div> : null}

        {tab === "site" ? <div className="adminPanels">
          <section className="adminPanel"><h2>Identity & hero · {locale.toUpperCase()}</h2><div className="adminGrid2"><Input label="Name" value={page.identity.name} onChange={(value) => updateLocale({ identity: { ...page.identity, name: value } })} /><Input label="Role" value={page.identity.role} onChange={(value) => updateLocale({ identity: { ...page.identity, role: value } })} /></div><Input label="Availability" value={page.identity.availability} onChange={(value) => updateLocale({ identity: { ...page.identity, availability: value } })} /><Input label="Hero eyebrow" value={page.hero.eyebrow} onChange={(value) => updateLocale({ hero: { ...page.hero, eyebrow: value } })} /><div className="adminGrid3"><Input label="Headline prefix" value={page.hero.headlinePrefix} onChange={(value) => updateLocale({ hero: { ...page.hero, headlinePrefix: value } })} /><Input label="Accent" value={page.hero.headlineAccent} onChange={(value) => updateLocale({ hero: { ...page.hero, headlineAccent: value } })} /><Input label="Suffix" value={page.hero.headlineSuffix} onChange={(value) => updateLocale({ hero: { ...page.hero, headlineSuffix: value } })} /></div><TextArea label="Hero description" value={page.hero.description} onChange={(value) => updateLocale({ hero: { ...page.hero, description: value } })} /></section>
          <section className="adminPanel"><h2>Section headings · {locale.toUpperCase()}</h2><Input label="Work title" value={page.work.title} onChange={(value) => updateLocale({ work: { ...page.work, title: value } })} /><TextArea label="Work description" value={page.work.description} onChange={(value) => updateLocale({ work: { ...page.work, description: value } })} /><Input label="Approach title" value={page.approach.title} onChange={(value) => updateLocale({ approach: { ...page.approach, title: value } })} /><TextArea label="Approach description" value={page.approach.description} onChange={(value) => updateLocale({ approach: { ...page.approach, description: value } })} /><Input label="Services title" value={page.services.title} onChange={(value) => updateLocale({ services: { ...page.services, title: value } })} /><Input label="Stack title" value={page.stack.title} onChange={(value) => updateLocale({ stack: { ...page.stack, title: value } })} /></section>
          <section className="adminPanel"><h2>About & contact · {locale.toUpperCase()}</h2><Input label="About title" value={page.about.title} onChange={(value) => updateLocale({ about: { ...page.about, title: value } })} />{page.about.paragraphs.map((paragraph, index) => <TextArea key={index} label={`About paragraph ${index+1}`} value={paragraph} onChange={(value) => { const paragraphs=[...page.about.paragraphs]; paragraphs[index]=value; updateLocale({ about:{...page.about,paragraphs} }); }} />)}<Input label="Contact title" value={page.contact.title} onChange={(value) => updateLocale({ contact: { ...page.contact, title: value } })} /><TextArea label="Contact description" value={page.contact.description} onChange={(value) => updateLocale({ contact: { ...page.contact, description: value } })} /></section>
        </div> : null}

        {tab === "projects" ? <div className="adminProjectLayout">
          <div className="adminProjectList"><button className="primaryButton adminAddProject" onClick={addProject}><Plus size={15} /> Add app</button>{content.projects.map((item,index) => <button key={item.id} className={index===selectedProject?"active":""} onClick={() => setSelectedProject(index)}><span>{item.index}</span><strong>{item.name[locale]}</strong><small>{item.status[locale]}</small></button>)}</div>
          {project ? <section className="adminPanel"><div className="adminPanelHeader"><div><h2>{project.name[locale]}</h2><p className="adminHelp">Localized text is edited in {locale.toUpperCase()}. Technologies, images, ID, order, accent and featured status are shared by EN and AR.</p></div><button className="dangerButton" onClick={deleteProject}><Trash2 size={15} /> Delete</button></div><div className="adminGrid2"><Input label="Name" value={project.name[locale]} onChange={(value) => updateProject({ name: { ...project.name, [locale]: value } })} /><Input label="Category" value={project.category[locale]} onChange={(value) => updateProject({ category: { ...project.category, [locale]: value } })} /><Input label="Status" value={project.status[locale]} onChange={(value) => updateProject({ status: { ...project.status, [locale]: value } })} /><Input label="Index" value={project.index} onChange={(value) => updateProject({ index: value })} /></div><TextArea label="Short version" value={project.short[locale]} onChange={(value) => updateProject({ short: { ...project.short, [locale]: value } })} /><TextArea label="Full description" value={project.description[locale]} rows={7} onChange={(value) => updateProject({ description: { ...project.description, [locale]: value } })} /><TextArea label="Problem addressed" value={project.caseStudy?.problem[locale] ?? ""} onChange={(value) => updateProject({ caseStudy: { problem: { en: "", ar: "", ...project.caseStudy?.problem, [locale]: value }, contribution: project.caseStudy?.contribution ?? { en: "", ar: "" } } })} /><TextArea label="My contribution (verified work only)" value={project.caseStudy?.contribution[locale] ?? ""} onChange={(value) => updateProject({ caseStudy: { problem: project.caseStudy?.problem ?? { en: "", ar: "" }, contribution: { en: "", ar: "", ...project.caseStudy?.contribution, [locale]: value } } })} /><Input label="Project SEO title" value={project.seo?.title[locale] ?? ""} onChange={(value) => updateProject({ seo: { title: { en: "", ar: "", ...project.seo?.title, [locale]: value }, description: project.seo?.description ?? { en: "", ar: "" } } })} /><TextArea label="Project meta description" value={project.seo?.description[locale] ?? ""} onChange={(value) => updateProject({ seo: { title: project.seo?.title ?? { en: "", ar: "" }, description: { en: "", ar: "", ...project.seo?.description, [locale]: value } } })} /><Input label="Technologies (comma separated, shared)" value={project.technologies.join(", ")} onChange={(value) => updateProject({ technologies: value.split(",").map((x)=>x.trim()).filter(Boolean) })} /><Input label={`Highlights · ${locale.toUpperCase()}`} value={project.highlights[locale].join(", ")} onChange={(value) => updateProject({ highlights: { ...project.highlights, [locale]: value.split(",").map((x)=>x.trim()).filter(Boolean) } })} /><label className="adminCheck"><input type="checkbox" checked={project.featured !== false} onChange={(e) => updateProject({ featured: e.target.checked })} /> Show on homepage</label><label className="adminField"><span>Accent</span><select value={project.accent} onChange={(e)=>updateProject({ accent:e.target.value as Project["accent"] })}><option value="amber">Amber</option><option value="blue">Blue</option><option value="violet">Violet</option><option value="green">Green</option></select></label><div className="adminSubhead"><h3>Screenshots</h3><label className="uploadButton"><ImagePlus size={15}/> Upload screenshot<input type="file" accept="image/*" onChange={(e)=>void uploadProjectImage(e.target.files?.[0])}/></label></div><div className="adminImages">{project.images.map((image,imageIndex)=><div className="adminImageRow" key={`${image.src}-${imageIndex}`}><img src={image.src} alt=""/><div><Input label={`Label · ${locale.toUpperCase()}`} value={image.label[locale]} onChange={(value)=>{const images=[...project.images];images[imageIndex]={...images[imageIndex],label:{...images[imageIndex].label,[locale]:value}};updateProject({images});}}/><Input label="Image URL (shared)" value={image.src} onChange={(value)=>{const images=[...project.images];images[imageIndex]={...images[imageIndex],src:value};updateProject({images});}}/><TextArea label={`Description · ${locale.toUpperCase()}`} rows={2} value={image.description[locale]} onChange={(value)=>{const images=[...project.images];images[imageIndex]={...images[imageIndex],description:{...images[imageIndex].description,[locale]:value}};updateProject({images});}}/></div><button className="iconDanger" onClick={()=>updateProject({images:project.images.filter((_,i)=>i!==imageIndex)})}><Trash2 size={15}/></button></div>)}</div></section> : null}
        </div> : null}

        {tab === "lists" ? <div className="adminPanels">
          <section className="adminPanel"><div className="adminPanelHeader"><h2>Services · {locale.toUpperCase()}</h2><button className="ghostButton" onClick={()=>updateLocale({services:{...page.services,items:[...page.services.items,{title:"New service",description:"Description"}]}})}><Plus size={15}/> Add</button></div>{page.services.items.map((item,index)=><div className="adminListRow" key={index}><div><Input label="Title" value={item.title} onChange={(value)=>{const items=[...page.services.items];items[index]={...items[index],title:value};updateLocale({services:{...page.services,items}});}}/><TextArea label="Description" rows={2} value={item.description} onChange={(value)=>{const items=[...page.services.items];items[index]={...items[index],description:value};updateLocale({services:{...page.services,items}});}}/></div><button className="iconDanger" onClick={()=>updateLocale({services:{...page.services,items:page.services.items.filter((_,i)=>i!==index)}})}><Trash2 size={15}/></button></div>)}</section>
          <section className="adminPanel"><div className="adminPanelHeader"><h2>Approach · {locale.toUpperCase()}</h2><button className="ghostButton" onClick={()=>updateLocale({approach:{...page.approach,items:[...page.approach.items,{title:"New item",description:"Description"}]}})}><Plus size={15}/> Add</button></div>{page.approach.items.map((item,index)=><div className="adminListRow" key={index}><div><Input label="Title" value={item.title} onChange={(value)=>{const items=[...page.approach.items];items[index]={...items[index],title:value};updateLocale({approach:{...page.approach,items}});}}/><TextArea label="Description" rows={2} value={item.description} onChange={(value)=>{const items=[...page.approach.items];items[index]={...items[index],description:value};updateLocale({approach:{...page.approach,items}});}}/></div><button className="iconDanger" onClick={()=>updateLocale({approach:{...page.approach,items:page.approach.items.filter((_,i)=>i!==index)}})}><Trash2 size={15}/></button></div>)}</section>
          <section className="adminPanel"><div className="adminPanelHeader"><h2>Technology stack · {locale.toUpperCase()}</h2><button className="ghostButton" onClick={()=>updateLocale({stack:{...page.stack,items:[...page.stack.items,{title:"Category",value:"Technology"}]}})}><Plus size={15}/> Add</button></div>{page.stack.items.map((item,index)=><div className="adminListRow" key={index}><div className="adminGrid2"><Input label="Category" value={item.title} onChange={(value)=>{const items=[...page.stack.items];items[index]={...items[index],title:value};updateLocale({stack:{...page.stack,items}});}}/><Input label="Value" value={item.value} onChange={(value)=>{const items=[...page.stack.items];items[index]={...items[index],value};updateLocale({stack:{...page.stack,items}});}}/></div><button className="iconDanger" onClick={()=>updateLocale({stack:{...page.stack,items:page.stack.items.filter((_,i)=>i!==index)}})}><Trash2 size={15}/></button></div>)}</section>
        </div> : null}

        {tab === "contact" ? <div className="adminPanels"><section className="adminPanel"><h2>Contact links</h2><div className="adminGrid2"><Input label="Email" value={content.settings.email} onChange={(value)=>setContent({...content,settings:{...content.settings,email:value}})}/><Input label="Mobile number" value={content.settings.phone} onChange={(value)=>setContent({...content,settings:{...content.settings,phone:value}})}/><Input label="GitHub URL" value={content.settings.githubUrl} onChange={(value)=>setContent({...content,settings:{...content.settings,githubUrl:value}})}/><Input label="LinkedIn URL" value={content.settings.linkedinUrl} onChange={(value)=>setContent({...content,settings:{...content.settings,linkedinUrl:value}})}/></div><Input label="Google Calendar Appointment Schedule URL" value={content.settings.bookingUrl} onChange={(value)=>setContent({...content,settings:{...content.settings,bookingUrl:value}})} placeholder="https://calendar.app.google/..."/><Input label="Optional Google booking embed URL" value={content.settings.bookingEmbedUrl} onChange={(value)=>setContent({...content,settings:{...content.settings,bookingEmbedUrl:value}})}/><Input label="Optional WhatsApp URL (only add if this number uses WhatsApp)" value={content.settings.whatsappUrl} onChange={(value)=>setContent({...content,settings:{...content.settings,whatsappUrl:value}})}/></section><section className="adminPanel"><h2>Resume / CV</h2><Input label="CV URL" value={content.settings.cvUrl} onChange={(value)=>setContent({...content,settings:{...content.settings,cvUrl:value}})}/><label className="uploadDrop"><UploadCloud size={26}/><strong>Upload CV</strong><span>PDF recommended</span><input type="file" accept="application/pdf" onChange={(e)=>void uploadCv(e.target.files?.[0])}/></label></section></div> : null}

        {tab === "seo" ? <section className="adminPanel"><h2>SEO · {locale.toUpperCase()}</h2><p className="adminHelp">Use natural phrases that match your real services. Avoid keyword stuffing. The website automatically generates canonical links, hreflang, sitemap.xml, robots.txt, Open Graph, Twitter metadata, and JSON-LD.</p><Input label="SEO title" value={page.seo.title} onChange={(value)=>updateLocale({seo:{...page.seo,title:value}})}/><TextArea label="Meta description" value={page.seo.description} onChange={(value)=>updateLocale({seo:{...page.seo,description:value}})}/><TextArea label="Keywords (comma separated)" value={page.seo.keywords.join(", ")} onChange={(value)=>updateLocale({seo:{...page.seo,keywords:value.split(",").map((x)=>x.trim()).filter(Boolean)}})}/></section> : null}

        {tab === "advanced" ? <section className="adminPanel"><div className="adminPanelHeader"><div><h2>Full site JSON</h2><p className="adminHelp">Edit any EN/AR content, projects, contact links, media, or settings.</p></div><button className="ghostButton" onClick={applyJson}>Apply JSON</button></div><textarea className="jsonEditor" value={jsonText} onChange={(e)=>setJsonText(e.target.value)} spellCheck={false}/></section> : null}
      </main>
    </div>
  );
}
