"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ReviewFilterProps {
  filter: string;
  setFilter: (value: string) => void;
}

export default function StarFilter({ filter, setFilter }: ReviewFilterProps) {
  return (
    <div className="animate-slide-in-from-bottom animation-delay-300">
      <Card>
        <CardContent className="p-6 font-poppins">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Filtrar por:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-[#FC9056] hover:bg-[#ff8340] cursor-pointer" : "cursor-pointer"}
              >
                Todas
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filter === rating.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(rating.toString())}
                  className={filter === rating.toString() ? "bg-[#FC9056] hover:bg-[#ff8340] cursor-pointer" : "cursor-pointer"}
                >
                  {rating} ⭐
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
