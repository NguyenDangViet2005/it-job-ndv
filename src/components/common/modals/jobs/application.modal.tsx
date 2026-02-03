"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ApplicationForm from "@/components/common/forms/jobs/application.form";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobid: number;
  jobTitle: string;
  companyName: string;
}

export default function ApplicationModal({
  open,
  onOpenChange,
  jobid,
  jobTitle,
  companyName,
}: ApplicationModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ứng tuyển công việc</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-2 space-y-1">
              <span className="block font-semibold text-gray-900 dark:text-gray-100">{jobTitle}</span>
              <span className="block text-sm text-gray-600 dark:text-gray-400">{companyName}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <ApplicationForm
          jobid={jobid}
          jobTitle={jobTitle}
          companyName={companyName}
          onClose={handleClose}
          isModal={true}
        />
      </DialogContent>
    </Dialog>
  );
}
