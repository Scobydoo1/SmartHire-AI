import React, { useState, useCallback } from "react";
import { UploadCloud, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const JobCreation: React.FC = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "analyzing" | "complete"
  >("idle");
  const [progress, setProgress] = useState(0);

  // Simulated Drag and Drop / Upload Flow
  const handleFileUpload = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    ) => {
      e.preventDefault();
      setUploadState("uploading");
      setProgress(0);

      // Simulate S3 File Upload
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            setUploadState("analyzing");

            // Simulate AI Bedrock Analysis
            setTimeout(() => {
              setUploadState("complete");
            }, 3000);
            return 100;
          }
          return prev + 15;
        });
      }, 300);
    },
    [],
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            Create New Job
          </h1>
          <p className="text-zinc-400 mt-1">
            Upload a Job Description and let AI build the interview framework.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form Details */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 bg-zinc-900/50 border-zinc-800 flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">
                Seniority
              </label>
              <Select>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-300">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  <SelectItem value="lead">Lead / Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-end">
              <Button
                disabled={uploadState !== "complete"}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
              >
                Create Interview Blueprint
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Drag and Drop JD */}
        <div className="flex flex-col gap-6">
          <div
            className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all duration-300 ${
              uploadState === "idle"
                ? "border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer"
                : "border-zinc-800 bg-zinc-900/30"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={uploadState === "idle" ? handleFileUpload : undefined}
          >
            {uploadState === "idle" && (
              <>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  title="Upload Job Description"
                  placeholder="Upload Job Description"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6 text-zinc-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                  Upload Job Description
                </h3>
                <p className="text-sm text-zinc-500 text-center">
                  Drag and drop your PDF or DOCX file here, or click to browse.
                </p>
              </>
            )}

            {uploadState === "uploading" && (
              <div className="w-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                  <UploadCloud className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                  Uploading to S3...
                </h3>
                <Progress value={progress} className="h-2 w-full bg-zinc-800" />
                <p className="text-xs text-zinc-500 mt-2">
                  {progress}% complete
                </p>
              </div>
            )}

            {uploadState === "analyzing" && (
              <div className="w-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 text-orange-400 relative">
                  <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-ping" />
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-200">
                  AI is Analyzing JD...
                </h3>
                <p className="text-sm text-zinc-500 mt-2 text-center max-w-[250px]">
                  Extracting technical skills, soft skills, and required
                  experience levels via AWS Bedrock.
                </p>
              </div>
            )}

            {uploadState === "complete" && (
              <div className="w-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                  Analysis Complete
                </h3>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-sm mt-2">
                  <FileText className="w-4 h-4 text-zinc-400" />{" "}
                  req_frontend_senior.pdf
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
