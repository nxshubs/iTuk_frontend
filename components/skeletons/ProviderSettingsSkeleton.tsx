"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; 
import SidebarMenu from "@/components/shared/SidebarMenu";
import DashboardHeader from "@/components/shared/DashboardHeader";

export const ProviderSettingsSkeleton = () => (
    <div className="min-h-screen bg-muted/30">
        <SidebarMenu isOpen={false} onClose={() => {}} />
        <div className="md:ml-64">
            <DashboardHeader onMobileMenuToggle={() => {}} />
            <main className="p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <Skeleton className="h-10 w-64 mb-2 bg-gray-200 rounded animate-pulse" />
                        <Skeleton className="h-6 w-80 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                        <Skeleton className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <Skeleton className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Skeleton className="h-12 w-full mt-8 bg-gray-200 rounded animate-pulse" />
                </div>
            </main>
        </div>
    </div>
);