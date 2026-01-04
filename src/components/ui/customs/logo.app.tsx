
import { Link } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { ROUTES } from "@/configs";

const LogoApp = () => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link href={ROUTES.HOME} className="cursor-target">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 cursor-target">
            <AvatarImage src="https://github.com/shadcn.png" alt="IT Job" />
            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-purple-600 text-white font-semibold">
              IJ
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link
          href={ROUTES.HOME}
          className="flex items-center space-x-1 cursor-target"
        >
          <h1 className="text-xl font-bold">
            <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
              IT
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Job
            </span>
          </h1>
        </Link>
      </div>
    </>
  );
};

export default LogoApp;
