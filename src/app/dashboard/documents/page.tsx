"use client";

import { useState } from "react";
import {
  Folder,
  Search,
  Upload,
  Download,
  FolderPlus,
} from "lucide-react";
import {
  NewFolderModal,
  type NewFolderInput,
} from "@/features/documents/components/new-folder.modal";
import {
  UploadDocumentModal,
  type NewDocumentInput,
} from "@/features/documents/components/upload-document.modal";

interface ClubFolder {
  name: string;
  count: number;
  updated: string;
}

interface ClubDoc {
  id: string;
  name: string;
  folder: string;
  size: string;
  uploadedBy: string;
  updatedAt: string;
  format: "PDF" | "DOCX" | "XLSX";
}

const INITIAL_FOLDERS: ClubFolder[] = [
  { name: "Policies & Governance", count: 8, updated: "Aug 2026" },
  { name: "Athlete Contracts", count: 42, updated: "Yesterday" },
  { name: "Medical Records", count: 31, updated: "2 hours ago" },
  { name: "Training Curriculums", count: 14, updated: "Last week" },
  { name: "Administration & Finance", count: 19, updated: "Sep 1, 2026" },
];

const INITIAL_DOCS: ClubDoc[] = [
  {
    id: "doc-1",
    name: "FERWAFA_Premier_League_Regulations_2026-27.pdf",
    folder: "Policies & Governance",
    size: "3.4 MB",
    uploadedBy: "Solange Umutoni",
    updatedAt: "Sep 7, 2026",
    format: "PDF",
  },
  {
    id: "doc-2",
    name: "Medical_Clearance_Senior_Squad_Q3.pdf",
    folder: "Medical Records",
    size: "1.8 MB",
    uploadedBy: "Dr. Patrick Manzi",
    updatedAt: "2h ago",
    format: "PDF",
  },
  {
    id: "doc-3",
    name: "Kigali_FC_Standard_Pro_Contract_Template.docx",
    folder: "Athlete Contracts",
    size: "420 KB",
    uploadedBy: "Jean Bosco R.",
    updatedAt: "Aug 28, 2026",
    format: "DOCX",
  },
  {
    id: "doc-4",
    name: "Tactical_Curriculum_Academy_U15_U17.pdf",
    folder: "Training Curriculums",
    size: "5.2 MB",
    uploadedBy: "Dieudonné H.",
    updatedAt: "Aug 15, 2026",
    format: "PDF",
  },
  {
    id: "doc-5",
    name: "Matchday_14_Operational_Budget.xlsx",
    folder: "Administration & Finance",
    size: "890 KB",
    uploadedBy: "Solange Umutoni",
    updatedAt: "Sep 6, 2026",
    format: "XLSX",
  },
];

export default function DocumentsPage() {
  const [folders, setFolders] = useState<ClubFolder[]>(INITIAL_FOLDERS);
  const [docs, setDocs] = useState<ClubDoc[]>(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string | null>(null);

  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleCreateFolder = (newFolder: NewFolderInput) => {
    const created: ClubFolder = {
      name: newFolder.name,
      count: 0,
      updated: "Just now",
    };
    setFolders((prev) => [...prev, created]);
  };

  const handleUploadDocument = (newDoc: NewDocumentInput) => {
    const created: ClubDoc = {
      ...newDoc,
      id: `doc-${Date.now()}`,
    };
    setDocs((prev) => [created, ...prev]);

    // Update folder count
    setFolders((prev) =>
      prev.map((f) =>
        f.name === newDoc.folder ? { ...f, count: f.count + 1, updated: "Just now" } : f
      )
    );
  };

  const handleDownloadDoc = (doc: ClubDoc) => {
    // Generate sample text file blob to trigger browser download
    const blob = new Blob([`ClubSheet Document Export\nName: ${doc.name}\nFolder: ${doc.folder}\nSize: ${doc.size}\nDate: ${doc.updatedAt}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocs = docs.filter((doc) => {
    if (selectedFolderFilter && doc.folder !== selectedFolderFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.folder.toLowerCase().includes(q) ||
        doc.uploadedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Secure digital repository for club legal files, contracts, medical forms, and policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewFolderModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
          >
            <FolderPlus className="h-3.5 w-3.5 text-muted-foreground" />
            New Folder
          </button>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Folder Categories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Club Document Directories
          </h2>
          {selectedFolderFilter && (
            <button
              type="button"
              onClick={() => setSelectedFolderFilter(null)}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Clear folder filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {folders.map((f) => {
            const isSelected = selectedFolderFilter === f.name;
            return (
              <div
                key={f.name}
                onClick={() => setSelectedFolderFilter(isSelected ? null : f.name)}
                className={`rounded-2xl border p-4 shadow-xs transition-all cursor-pointer group text-card-foreground ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Folder
                    className={`h-6 w-6 transition-colors ${
                      isSelected ? "text-primary" : "text-warning group-hover:text-primary"
                    }`}
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {f.count} files
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-bold text-foreground line-clamp-1">
                  {f.name}
                </h3>
                <p className="mt-1 text-[10px] text-muted-foreground">Updated {f.updated}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Recent Files Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title, folder..."
              className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {selectedFolderFilter ? `Showing files in ${selectedFolderFilter}` : "Showing all documents"}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Directory</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4">Last Modified</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No documents match your query or selected directory.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                              doc.format === "PDF"
                                ? "bg-danger/10 text-danger border border-danger/20"
                                : doc.format === "DOCX"
                                ? "bg-info/10 text-info border border-info/20"
                                : "bg-success/10 text-success border border-success/20"
                            }`}
                          >
                            {doc.format}
                          </span>
                          <span
                            onClick={() => handleDownloadDoc(doc)}
                            className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{doc.folder}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{doc.size}</td>
                      <td className="py-3 px-4 text-muted-foreground">{doc.uploadedBy}</td>
                      <td className="py-3 px-4 text-muted-foreground">{doc.updatedAt}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(doc)}
                          aria-label={`Download ${doc.name}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Get</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isNewFolderModalOpen && (
        <NewFolderModal
          isOpen
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreateFolder={handleCreateFolder}
        />
      )}

      {isUploadModalOpen && (
        <UploadDocumentModal
          isOpen
          onClose={() => setIsUploadModalOpen(false)}
          folders={folders.map((f) => f.name)}
          onUploadDocument={handleUploadDocument}
        />
      )}
    </div>
  );
}
