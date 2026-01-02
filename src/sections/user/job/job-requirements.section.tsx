import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { CheckCircle2, Code, GraduationCap, Users } from "lucide-react";

interface JobRequirementsProps {
  requirements?: {
    technical: string[];
    experience: string[];
    education: string[];
    soft: string[];
  };
}

const JobRequirements = ({ requirements }: JobRequirementsProps) => {
  const defaultRequirements = {
    technical: [
      "Flutter/Dart programming",
      "Android Studio & Xcode",
      "REST API integration",
      "State management (Provider, Bloc)",
      "Git version control",
      "Firebase services",
    ],
    experience: [
      "2+ years Flutter development",
      "Mobile app deployment experience",
      "Cross-platform development",
      "Agile/Scrum methodology",
    ],
    education: [
      "Bachelor's in Computer Science",
      "Mobile Development certification",
      "Related technical field",
    ],
    soft: [
      "Problem-solving skills",
      "Team collaboration",
      "English communication",
      "Attention to detail",
      "Self-learning ability",
    ],
  };

  const req = requirements || defaultRequirements;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          Yêu cầu kỹ thuật
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {req.technical.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Kinh nghiệm & Kỹ năng mềm
        </h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
              Kinh nghiệm
            </h5>
            <div className="space-y-2">
              {req.experience.map((exp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{exp}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
              Kỹ năng mềm
            </h5>
            <div className="flex flex-wrap gap-2">
              {req.soft.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Học vấn
        </h4>
        <div className="space-y-2">
          {req.education.map((edu, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm">{edu}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobRequirements;
