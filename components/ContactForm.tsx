"use client";

import { recordContactIntent } from "@/lib/measurement";
import { Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { SiteLocaleContent } from "@/types/site";

export function ContactForm({ email, labels }: { email?: string; labels: SiteLocaleContent["ui"]["contactForm"] }) {
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState(labels.topics[0] ?? "Flutter project / opportunity");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const enabled = useMemo(() => Boolean(email && email.includes("@")), [email]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!enabled) {
      setStatus(labels.unavailable);
      return;
    }
    if (!name.trim() || !senderEmail.trim() || !message.trim()) {
      setStatus(labels.required);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail.trim())) {
      setStatus(labels.invalidEmail);
      return;
    }

    const body = [`${labels.name}: ${name}`, `${labels.email}: ${senderEmail}`, "", message].join("\n");
    recordContactIntent("email_prepared");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(labels.ready);
  };

  return (
    <form className="contactForm" onSubmit={submit} noValidate>
      <div className="formRow">
        <label>
          <span>{labels.name}</span>
          <input required dir="auto" value={name} onChange={(e) => setName(e.target.value)} placeholder={labels.namePlaceholder} autoComplete="name" />
        </label>
        <label>
          <span>{labels.email}</span>
          <input required dir="ltr" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder={labels.emailPlaceholder} type="email" autoComplete="email" />
        </label>
      </div>
      <label>
        <span>{labels.topic}</span>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {labels.topics.map((topic) => <option key={topic}>{topic}</option>)}
        </select>
      </label>
      <label>
        <span>{labels.message}</span>
        <textarea required dir="auto" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder={labels.messagePlaceholder} />
      </label>
      <button className="primaryButton big formSubmit" type="submit"><Send size={16} /> {labels.send}</button>
      {status ? <p className="formStatus" role="status">{status}</p> : null}
    </form>
  );
}
