import React from "react";

function NewestJobQASection({ jobs }: { jobs: any[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col h-1/3">
      <h2 className="text-lg font-bold mb-3">📌 Việc làm mới nhất</h2>
      <ul className="space-y-2 overflow-y-auto pr-2 flex-1">
        {jobs.map((job) => (
          <li key={job.id} className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{job.title}</span> <br />
            <span className="text-xs text-gray-500">{job.company}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewestJobQASection;
