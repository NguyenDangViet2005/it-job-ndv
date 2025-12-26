import { Badge } from "@/components/ui/shadcn/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";

import { Star, Phone, Mail, FileText, Calendar } from "lucide-react";

const CandidateProfile = ({ candidate }: { candidate: any }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-mono">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={candidate.avatar} alt={candidate.name} />
          <AvatarFallback className="text-lg">
            {candidate.name
              .split(" ")
              .map((n: any) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold">{candidate.name}</h3>
          <p className="text-muted-foreground">{candidate.position}</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span className="font-mono">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span className="font-mono">{candidate.phone}</span>
            </div>
          </div>
          {renderStars(candidate.rating)}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-mono">BASIC INFO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Experience:</span>
              <span className="text-sm font-mono">{candidate.experience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Applied:</span>
              <span className="text-sm font-mono">
                {new Date(candidate.dateApplied).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant="outline">
                {candidate.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-mono">SKILLS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill: any) => (
                <Badge key={skill} variant="secondary" className="font-mono">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-mono">NOTES</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{candidate.notes}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="sm" className="font-mono">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
        <Button variant="outline" size="sm" className="font-mono">
          <FileText className="h-4 w-4 mr-2" />
          View Resume
        </Button>
        <Button variant="outline" size="sm" className="font-mono">
          Move to Next Stage
        </Button>
        <Button variant="destructive" size="sm" className="font-mono">
          Reject
        </Button>
      </div>
    </div>
  );
};

export default CandidateProfile;
