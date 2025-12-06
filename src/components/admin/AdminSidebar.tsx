"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Settings,
  Menu,
  ChevronsUpDown,
  Plus,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { Organization } from "@/types";
import { getOrganizationsAction } from "@/app/actions";

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
        const orgs = await getOrganizationsAction();
        setOrganizations(orgs);
    
        const match = pathname.match(/\/admin\/organizations\/([^\/]+)/);
        if (match) {
          const orgId = match[1];
          if (orgId === 'new') {
            setCurrentOrg(null);
          } else {
            const found = orgs.find(o => o.id === orgId);
            if (found) setCurrentOrg(found);
          }
        } else {
            setCurrentOrg(null);
        }
    };

    fetchOrgs();

    const handleOrgUpdate = () => {
        fetchOrgs();
    };

    window.addEventListener('organization-updated', handleOrgUpdate);

    return () => {
        window.removeEventListener('organization-updated', handleOrgUpdate);
    };
  }, [pathname]);

  const handleOrgChange = (org: Organization) => {
      router.push(`/admin/organizations/${org.id}`);
  };

  const getSidebarItems = (): SidebarItem[] => {
      if (currentOrg) {
          return [
              {
                  title: "Dashboard",
                  href: `/admin/organizations/${currentOrg.id}`,
                  icon: LayoutDashboard,
              },
              {
                  title: "People",
                  href: `/admin/organizations/${currentOrg.id}/people`,
                  icon: Users,
              },
              {
                  title: "Teams",
                  href: `/admin/organizations/${currentOrg.id}/teams`,
                  icon: Trophy,
              },
              {
                  title: "Venues",
                  href: `/admin/organizations/${currentOrg.id}/venues`,
                  icon: MapPin,
              },
              {
                  title: "Events",
                  href: `/admin/organizations/${currentOrg.id}/events`,
                  icon: Calendar,
              },
          ];
      }

      return [
          {
              title: "Dashboard",
              href: "/admin",
              icon: LayoutDashboard,
          },
      ];
  };

  const items = getSidebarItems();

  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between mb-4 h-auto py-2">
                <div className="flex items-center gap-2 truncate">
                    {currentOrg?.logo ? (
                        <div className="w-6 h-6 rounded-md overflow-hidden border border-border bg-background flex-shrink-0">
                            <img src={currentOrg.logo} alt={currentOrg.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="truncate">
                        {currentOrg ? currentOrg.name : "Select Organization"}
                    </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuLabel>My Organizations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onSelect={() => handleOrgChange(org)}
                  className="justify-between mb-1 cursor-pointer"
                  style={{
                      backgroundColor: org.primaryColor || 'transparent',
                      borderColor: org.secondaryColor || 'transparent',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      color: '#ffffff' // Assuming dark primary colors for now, or we could calculate contrast
                  }}
                >
                  <div className="flex items-center gap-2">
                      {org.logo ? (
                          <div className="w-8 h-8 rounded-md overflow-hidden border border-border bg-background flex-shrink-0">
                              <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                          </div>
                      ) : (
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                      )}
                      <span className="font-medium drop-shadow-md">{org.name}</span>
                  </div>
                  {currentOrg?.id === org.id && <Check className="h-4 w-4 drop-shadow-md" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/admin/organizations/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-2 mt-auto">
        <div className="space-y-1">
            <div className="my-2 border-t border-border/50" />
            <Button
                variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
            >
                <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

    useEffect(() => {
    const fetchOrgs = async () => {
        const orgs = await getOrganizationsAction();
        setOrganizations(orgs);
    
        const match = pathname.match(/\/admin\/organizations\/([^\/]+)/);
        if (match) {
          const orgId = match[1];
          if (orgId === 'new') {
            setCurrentOrg(null);
          } else {
            const found = orgs.find(o => o.id === orgId);
            if (found) setCurrentOrg(found);
          }
        } else {
            setCurrentOrg(null);
        }
    };

    fetchOrgs();

    const handleOrgUpdate = () => {
        fetchOrgs();
    };

    window.addEventListener('organization-updated', handleOrgUpdate);

    return () => {
        window.removeEventListener('organization-updated', handleOrgUpdate);
    };
  }, [pathname]);

    const getSidebarItems = (): SidebarItem[] => {
        if (currentOrg) {
            return [
                {
                    title: "Dashboard",
                    href: `/admin/organizations/${currentOrg.id}`,
                    icon: LayoutDashboard,
                },
                {
                    title: "People",
                    href: `/admin/organizations/${currentOrg.id}/people`,
                    icon: Users,
                },
                {
                    title: "Teams",
                    href: `/admin/organizations/${currentOrg.id}/teams`,
                    icon: Trophy,
                },
                {
                    title: "Venues",
                    href: `/admin/organizations/${currentOrg.id}/venues`,
                    icon: MapPin,
                },
                {
                    title: "Events",
                    href: `/admin/organizations/${currentOrg.id}/events`,
                    icon: Calendar,
                },
            ];
        }
  
        return [
            {
                title: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
            },
        ];
    };

    const items = getSidebarItems();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 flex flex-col h-full">
                <div className="px-3 py-2 flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between mb-4 h-auto py-2">
                            <div className="flex items-center gap-2 truncate">
                                {currentOrg?.logo ? (
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-border bg-background flex-shrink-0">
                                        <img src={currentOrg.logo} alt={currentOrg.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="truncate">
                                    {currentOrg ? currentOrg.name : "Select Organization"}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                        <DropdownMenuLabel>My Organizations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {organizations.map((org) => (
                            <DropdownMenuItem
                            key={org.id}
                            onSelect={() => {
                                router.push(`/admin/organizations/${org.id}`);
                                setOpen(false);
                            }}
                            className="justify-between mb-1 cursor-pointer"
                            style={{
                                backgroundColor: org.primaryColor || 'transparent',
                                borderColor: org.secondaryColor || 'transparent',
                                borderWidth: '2px',
                                borderStyle: 'solid',
                                color: '#ffffff'
                            }}
                            >
                            <div className="flex items-center gap-2">
                                {org.logo ? (
                                    <div className="w-8 h-8 rounded-md overflow-hidden border border-border bg-background flex-shrink-0">
                                        <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                                <span className="font-medium drop-shadow-md">{org.name}</span>
                            </div>
                            {currentOrg?.id === org.id && <Check className="h-4 w-4 drop-shadow-md" />}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => {
                            router.push("/admin/organizations/new");
                            setOpen(false);
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Admin
                    </h2>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                                onClick={() => setOpen(false)}
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="px-3 py-2 mt-auto">
                    <div className="space-y-1">
                        <div className="my-2 border-t border-border/50" />
                        <Button
                            variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            asChild
                            onClick={() => setOpen(false)}
                        >
                            <Link href="/admin/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
