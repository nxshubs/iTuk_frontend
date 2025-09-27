import DashboardHeader from "../shared/DashboardHeader";
import SidebarMenu from "../shared/SidebarMenu";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const EditProfileSkeleton = () => (
    <div className="flex min-h-screen bg-muted/30">
        <div className="flex flex-col flex-1 md:ml-32">
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Skeleton className="h-10 w-24" />
                        <div>
                            <Skeleton className="h-9 w-48" />
                            <Skeleton className="h-5 w-64 mt-2" />
                        </div>
                    </div>
                    {/* Skeletons para cada card de formulário */}
                    <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-56 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
                    <div className="flex justify-end gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </main>
        </div>
    </div>
);

