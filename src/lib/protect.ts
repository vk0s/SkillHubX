import { redirect } from "next/navigation";
import { getSelf, isAdmin, isSuperAdmin } from "./auth";

export async function protect() {
    const user = await getSelf();
    if (!user) redirect("/");
}

export async function protectAdmin() {
    const isAdm = await isAdmin();
    if (!isAdm) redirect("/");
}

export async function protectSuperAdmin() {
    const isSup = await isSuperAdmin();
    if (!isSup) redirect("/");
}
