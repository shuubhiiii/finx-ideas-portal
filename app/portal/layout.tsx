import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { unreadCount } from "@/lib/notifications";
import PortalShell from "@/components/PortalShell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  const db = readDB();
  const unread = unreadCount(db, user.id);
  return (
    <PortalShell
      user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      unreadNotifications={unread}
    >
      {children}
    </PortalShell>
  );
}
