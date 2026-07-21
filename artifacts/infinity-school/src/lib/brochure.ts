/**
 * Centralized brochure configuration.
 *
 * To update the brochure, replace the file at:
 *   artifacts/infinity-school/public/brochure.pdf
 *
 * No code changes needed — every Download Brochure button reads from here.
 */

/** Absolute URL to the brochure PDF, respecting the Vite base path. */
export const BROCHURE_URL = `${import.meta.env.BASE_URL}brochure.pdf`;

/** Filename shown to the user when they download the file. */
export const BROCHURE_FILENAME = "Infinity-Public-School-Brochure.pdf";
