import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/shared/DashboardHeader";
import SidebarMenu from "@/components/shared/SidebarMenu";

export const SettingsPageSkeleton = () => (
  <div className="flex min-h-screen bg-muted/30">
    <SidebarMenu isOpen={false} onClose={() => {}} />
    <div className="flex flex-col flex-1 md:ml-64">
      <DashboardHeader onMobileMenuToggle={() => {}} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          {/* Settings Cards Skeleton */}
          <div className="space-y-6">
            {/* Card 1: Profile/Account */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            {/* Card 2: Become a Provider */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-48 mt-2" />
              </CardContent>
            </Card>

            {/* Card 3: Other settings */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-28" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </div>
      </main>
    </div>
  </div>
);