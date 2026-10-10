/**
 * The contact address, stored base64-encoded so it never appears as plain text
 * in the HTML or JavaScript we ship (basic scrapers regex for "name@domain").
 * Decode only in the browser, on a user action. This is obfuscation, not
 * secrecy: do not put the address in source, docs, or tests as a literal.
 */
const ENCODED = "amFzb25taWMyMDAwQGdtYWlsLmNvbQ==";

export const getEmail = (): string => atob(ENCODED);
