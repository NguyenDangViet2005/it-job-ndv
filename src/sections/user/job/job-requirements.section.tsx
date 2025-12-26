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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="cursor-target h-5 w-5 text-primary" />
            Yêu cầu kỹ thuật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {req.technical.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="cursor-target h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="cursor-target h-5 w-5 text-primary" />
            Kinh nghiệm & Kỹ năng mềm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                Kinh nghiệm
              </h4>
              <div className="space-y-2">
                {req.experience.map((exp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="cursor-target h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                Kỹ năng mềm
              </h4>
              <div className="flex flex-wrap gap-2">
                {req.soft.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-target text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="cursor-target h-5 w-5 text-primary" />
            Học vấn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {req.education.map((edu, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="cursor-target h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm">{edu}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRequirements;
