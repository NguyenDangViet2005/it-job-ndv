import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import React from "react";

const IntroCard = ({ data }: { data: any }) => {
  return (
    <>
      <CardAction
        className="group relative backdrop-blur-sm bg-card/80 border-primary/20 cursor-pointer p-4 w-full rounded-lg cursor-target
                   transition-all duration-300 ease-out transform-gpu
                   hover:scale-[1.01] hover:-translate-y-1 hover:rotate-1
                   hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1),0_0_20px_rgba(59,130,246,0.1)]
                   hover:bg-card/90 hover:border-primary/40
                   before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br 
                   before:from-transparent before:via-transparent before:to-primary/5
                   before:opacity-0 before:transition-opacity before:duration-300
                   hover:before:opacity-100
                   active:scale-[0.99] active:transition-transform active:duration-100"
      >
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-sm"
        />

        <div className="relative z-10">
          <CardHeader className="transition-transform duration-300 group-hover:translate-y-[-2px]">
            <CardTitle
              className="text-primary transition-all duration-300 
                                 group-hover:text-transparent group-hover:bg-gradient-to-r 
                                 group-hover:from-primary group-hover:via-blue-500 group-hover:to-purple-500 
                                 group-hover:bg-clip-text flex items-center gap-2"
            >
              {data.title}
            </CardTitle>
            <CardDescription className="transition-all duration-300 group-hover:text-foreground/80">
              {data.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="transition-transform duration-300 group-hover:translate-y-[-1px]">
            <p
              className="text-sm text-muted-foreground transition-all duration-300 
                          group-hover:text-foreground/70 leading-relaxed"
            >
              {data.content}
            </p>
          </CardContent>
        </div>

        <div
          className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full 
                        transform transition-all duration-700 group-hover:scale-150 
                        group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:bg-primary/60"
        />
        <div
          className="absolute bottom-6 left-6 w-1 h-1 bg-purple-500/30 rounded-full 
                        transform transition-all duration-500 delay-100 group-hover:scale-200 
                        group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:bg-purple-500/60"
        />
      </CardAction>
    </>
  );
};

export default IntroCard;
