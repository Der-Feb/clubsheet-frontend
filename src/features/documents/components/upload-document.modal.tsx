"use client";

import { useEffect, useState } from "react";
import { FileUp, X } from "lucide-react";
import { ScrollArea } from "@/components/ScrollArea";

export interface NewDocumentInput {
  name: string;
  folder: string;
  size: string;
  uploadedBy: string;
  updatedAt: string;
  format: "PDF" | "DOCX" | "XLSX";
}

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: string[];
  onUploadDocument: (document: NewDocumentInput) => void;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  folders,
  onUploadDocument,
}: UploadDocumentModalProps) {
  const [name, setName] = useState("");
  const [folder, setFolder] = useState(folders[0] ?? "");
  const [uploadedBy, setUploadedBy] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setFolder(folders[0] ?? "");
      setUploadedBy("");
      setFile(null);
      setError("");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [folders, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a document to upload");
      return;
    }
    if (!folders.includes(folder)) {
      setError("Choose a valid folder");
      return;
    }
    if (!uploadedBy.trim()) {
      setError("Enter the uploader's name");
      return;
    }

    const extension = file.name.split(".").pop()?.toUpperCase();
    if (extension !== "PDF" && extension !== "DOCX" && extension !== "XLSX") {
      setError("Only PDF, DOCX, and XLSX files are supported");
      return;
    }

    const size = file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    onUploadDocument({
      name: name.trim() || file.name,
      folder,
      size,
      uploadedBy: uploadedBy.trim(),
      updatedAt: "Just now",
      format: extension,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <ScrollArea
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-document-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" />
            <h2 id="upload-document-title" className="text-base font-bold text-foreground">
              Upload Document
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl border border-danger/20 bg-danger/10 p-3 text-xs font-medium text-danger">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="document-file" className="text-xs font-semibold text-foreground">
              Document file <span className="text-danger">*</span>
            </label>
            <input
              id="document-file"
              type="file"
              accept=".pdf,.docx,.xlsx"
              required
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setFile(selectedFile);
                if (!name.trim() && selectedFile) setName(selectedFile.name);
                setError("");
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="document-name" className="text-xs font-semibold text-foreground">
              Display name
            </label>
            <input
              id="document-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Use the file name"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="document-folder" className="text-xs font-semibold text-foreground">
                Folder <span className="text-danger">*</span>
              </label>
              <select
                id="document-folder"
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                required
                disabled={folders.length === 0}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {folders.map((folderName) => (
                  <option key={folderName} value={folderName}>{folderName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="document-uploader" className="text-xs font-semibold text-foreground">
                Uploaded by <span className="text-danger">*</span>
              </label>
              <input
                id="document-uploader"
                value={uploadedBy}
                onChange={(event) => setUploadedBy(event.target.value)}
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={folders.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upload Document
            </button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}
