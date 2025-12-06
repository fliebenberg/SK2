"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { store } from "@/lib/store";
import { Plus, ArrowRight, Building2 } from "lucide-react";
import { Organization } from "@/types";
import { getOrganizationsAction } from "@/app/actions";

export default function AdminPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const orgs = await getOrganizationsAction();
        setOrganizations(orgs);
        setLoading(false);

        if (orgs.length === 1) {
          router.push(`/admin/organizations/${orgs[0].id}`);
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        setLoading(false);
      }
    };

    fetchOrgs();
  }, [router]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // If 1 org, we are redirecting, so return null or loader
  if (organizations.length === 1) {
    return <div className="p-8">Redirecting to your organization...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Organizations</h1>
          <p className="text-muted-foreground">
            Select an organization to manage or create a new one.
          </p>
        </div>
        <Button asChild>
            <Link href="/admin/organizations/new">
                <Plus className="mr-2 h-4 w-4" /> Create Organization
            </Link>
        </Button>
      </div>

      {organizations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-[400px] border-2 border-dashed rounded-lg">
          <div className="p-4 bg-muted rounded-full">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No Organizations Found</h2>
          <p className="text-muted-foreground max-w-sm text-center">
            You don't have any organizations yet. Create one to get started with managing your teams and events.
          </p>
          <Button asChild>
            <Link href="/admin/organizations/new">
              <Plus className="mr-2 h-4 w-4" /> Create Organization
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/admin/organizations/${org.id}`)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{org.name}</CardTitle>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Sports: {org.sportTypes.join(", ")}
                  </div>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href={`/admin/organizations/${org.id}`}>
                      Manage Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
