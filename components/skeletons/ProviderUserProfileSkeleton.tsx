import DashboardHeader from "../shared/DashboardHeader";
import SidebarMenu from "../shared/SidebarMenu";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ProviderUserProfileSkeleton = () => (
  <div className="flex min-h-screen bg-muted/30">
    <SidebarMenu isOpen={false} onClose={() => { }} />
    <div className="flex flex-col flex-1 md:ml-64">
      <DashboardHeader onMobileMenuToggle={() => { }} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-6">
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="w-32 h-32 rounded-full mx-auto md:mx-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-10 w-48" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          </div>
        </div>
      </main>
    </div>
  </div>
);