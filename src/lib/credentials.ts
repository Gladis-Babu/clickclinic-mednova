// Human-in-the-loop credential review for the prototype care team.
// Nothing here contacts a licensing authority; only a reviewer action changes status.
export type CredStatus = "not_verified" | "pending" | "verified" | "rejected";
export type CredAction = "verify" | "request" | "reject";
export type CertFields = { certId: string; certName: string; certOrg: string; certIssue: string; certExpiry: string; hasFile: boolean };
export type ChecklistKey = "doc" | "id" | "name" | "org" | "issue" | "expiry" | "notExpired" | "external";

export function checklist(c: CertFields, today = new Date()): { key: ChecklistKey; ok: boolean }[] {
  const exp = c.certExpiry ? new Date(`${c.certExpiry}T23:59:59`) : null;
  return [
    { key: "doc", ok: c.hasFile },
    { key: "id", ok: !!c.certId.trim() },
    { key: "name", ok: !!c.certName.trim() },
    { key: "org", ok: !!c.certOrg.trim() },
    { key: "issue", ok: !!c.certIssue },
    { key: "expiry", ok: !!c.certExpiry },
    { key: "notExpired", ok: !!exp && exp >= today },
    // External licensing-authority verification is not connected in this prototype.
    { key: "external", ok: false },
  ];
}

export const submitForVerification = (s: CredStatus): CredStatus => (s === "not_verified" || s === "rejected" ? "pending" : s);

// Uploading a file or completing fields never changes status.
export const statusAfterUpload = (s: CredStatus): CredStatus => s;

export function reviewAction(s: CredStatus, a: CredAction): CredStatus {
  if (s !== "pending") return s;
  return a === "verify" ? "verified" : a === "reject" ? "rejected" : "pending";
}
