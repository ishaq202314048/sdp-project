import { redirect } from "next/navigation";

export default function AdjutantIndex() {
    // Redirect /dashboard/adjutant to the home page to avoid 404 when no index exists
    redirect("/dashboard/adjutant/home");
}
