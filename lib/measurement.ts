// An adapter hook only: no analytics SDK, network request, or personal form data.
// Connect a consent-managed analytics listener to this event in production.
export function recordContactIntent(method: "email" | "phone" | "booking" | "email_prepared") {
  window.dispatchEvent(new CustomEvent("portfolio:contact-intent", {
    detail: {
      event: "contact_intent",
      contact_method: method,
      page_path: window.location.pathname,
      page_language: document.documentElement.lang,
    },
  }));
}
