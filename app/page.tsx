import { redirect } from "next/navigation";

// work.bupcore.ai is only the origin for the lab pages that bottomup.app
// proxies through the analyst-proxy Cloudflare Worker. Anyone landing on
// the bare root goes to the real site.
export default function Root() {
  redirect("https://www.bottomup.app/");
}
