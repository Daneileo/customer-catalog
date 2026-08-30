/** Master catalog is for local `next dev` only, not the published customer site. */
export function isMasterEnabled() {
  return process.env.NODE_ENV !== "production";
}
