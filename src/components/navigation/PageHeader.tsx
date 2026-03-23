"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbStep {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface PageHeaderProps {
  backLabel?: string;
  backHref?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  breadcrumbs: BreadcrumbStep[];
}

export function PageHeader({
  backLabel = "Back",
  backHref,
  showBack = true,
  onBackClick,
  breadcrumbs,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-8 mb-4">
      {showBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack} 
          className="flex items-center gap-2 h-8 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Button>
      )}

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((step, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {step.isCurrent || !step.href ? (
                  <BreadcrumbPage>{step.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={step.href}>{step.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
