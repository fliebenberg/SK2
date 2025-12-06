"use client";

import { useState, useEffect, useRef } from "react";
import { Organization } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Building2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { store } from "@/lib/store";
import { useRouter } from "next/navigation";
import { updateOrganizationAction, createOrganizationAction } from "@/app/actions";

interface OrgDetailsHeaderProps {
  organization?: Organization;
  isCreating?: boolean;
}

export function OrgDetailsHeader({ organization, isCreating = false }: OrgDetailsHeaderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    logo: organization?.logo || "",
    primaryColor: organization?.primaryColor || "#000000",
    secondaryColor: organization?.secondaryColor || "#ffffff",
    sportTypes: organization?.sportTypes || [],
    shortName: organization?.shortName || "",
  });

  const nameInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus name input on creation
  useEffect(() => {
    if (isCreating && nameInputRef.current) {
        setTimeout(() => {
            nameInputRef.current?.focus();
        }, 100);
    }
  }, [isCreating]);

  // Auto-resize name textarea
  useEffect(() => {
    if (nameInputRef.current) {
        nameInputRef.current.style.height = 'auto';
        nameInputRef.current.style.height = nameInputRef.current.scrollHeight + 'px';
    }
  }, [formData.name]);

  const hasChanges = () => {
      if (isCreating) return true;
      if (!organization) return false;
      return (
          formData.name !== organization.name ||
          formData.logo !== organization.logo ||
          formData.primaryColor !== organization.primaryColor ||
          formData.secondaryColor !== organization.secondaryColor ||
          formData.shortName !== organization.shortName
      );
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    if (isCreating) {
        const newOrg = await createOrganizationAction({
            ...formData,
            sportTypes: formData.sportTypes || [],
        });
        
        window.dispatchEvent(new CustomEvent('organization-updated', { 
            detail: { orgId: newOrg.id } 
        }));

        router.push(`/admin/organizations/${newOrg.id}`);
    } else if (organization) {
        await updateOrganizationAction(organization.id, formData);
        
        window.dispatchEvent(new CustomEvent('organization-updated', { 
            detail: { orgId: organization.id } 
        }));
        
        router.refresh();
    }
  };

  const handleCancel = () => {
    if (isCreating) {
        router.back();
        return;
    }

    if (organization) {
        setFormData({
            name: organization.name,
            logo: organization.logo || "",
            primaryColor: organization.primaryColor || "#000000",
            secondaryColor: organization.secondaryColor || "#ffffff",
            sportTypes: organization.sportTypes || [],
            shortName: organization.shortName || "",
        });
    }
  };

  if (!organization && !isCreating) return null;

  return (
    <div className="flex flex-col gap-6 group">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Box 1: Logo */}
        <div className="w-32 h-32 flex-shrink-0 mx-auto md:mx-0">
             <ImageUpload
                value={formData.logo}
                onChange={(base64) => setFormData({ ...formData, logo: base64 })}
                className="w-full h-full rounded-md overflow-hidden shadow-sm border border-border"
                minimal
            />
        </div>
        
        {/* Box 2: Name and Code */}
        <div className="flex-1 flex flex-col gap-2 pt-1 min-w-0 w-full items-center md:items-start">
              <textarea
                ref={nameInputRef}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
                className="text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-none p-0 focus:outline-none resize-none overflow-hidden hover:bg-muted/50 transition-colors rounded px-2 md:-ml-2 w-full leading-tight text-center md:text-left break-words max-h-[6rem]"
                placeholder="Organization Name"
                rows={1}
                style={{ minHeight: '1.2em' }}
              />
              <div className="flex items-center gap-2 justify-center md:justify-start w-full md:w-auto">
                <span className="text-sm text-muted-foreground font-medium">CODE:</span>
                <Input
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase().slice(0, 6) })}
                    className="text-xl font-bold font-mono bg-transparent border-none p-0 h-auto focus-visible:ring-0 hover:bg-muted/50 transition-colors rounded px-1 w-24 text-center uppercase"
                    placeholder="SHS"
                    maxLength={6}
                />
              </div>
        </div>

        {/* Box 3: Colors and Buttons */}
        <div className="flex flex-col gap-4 flex-shrink-0 w-full md:w-auto items-center md:items-end">
            {hasChanges() && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 w-full md:w-auto justify-center md:justify-end">
                    <Button onClick={handleSave} size="sm" disabled={!formData.name.trim()}>
                        <Save className="w-4 h-4 mr-2" /> {isCreating ? "Create" : "Save"}
                    </Button>
                    <Button onClick={handleCancel} variant="ghost" size="sm">
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-3 text-sm text-muted-foreground w-fit md:w-auto items-start">
                <label className="flex items-center gap-2 group/color cursor-pointer relative">
                    <span className="w-6 h-6 rounded-md border block shadow-sm" style={{ backgroundColor: formData.primaryColor }} />
                    <span className="group-hover/color:text-foreground transition-colors">Primary</span>
                    <Input 
                        type="color" 
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                    />
                </label>
                <label className="flex items-center gap-2 group/color cursor-pointer relative">
                    <span className="w-6 h-6 rounded-md border block shadow-sm" style={{ backgroundColor: formData.secondaryColor }} />
                    <span className="group-hover/color:text-foreground transition-colors">Secondary</span>
                    <Input 
                        type="color" 
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                    />
                </label>
            </div>
        </div>
      </div>
    </div>
  );
}
