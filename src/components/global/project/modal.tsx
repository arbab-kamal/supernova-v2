"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: { id: string; title: string; description?: string }[];
  onAddToProject?: (id: string) => void;
  onCreateProject?: (data: { title: string; description?: string }) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projects,
  onAddToProject,
  onCreateProject,
}) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [hasChanges, setHasChanges] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  /* Reset form when (re)opened */
  useEffect(() => {
    if (isOpen) {
      setFormData({ title: "", description: "" });
      setHasChanges(false);
    }
  }, [isOpen]);

  /* Close on outside click */
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        hasChanges ? handleSave() : onClose();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen, hasChanges, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onCreateProject) {
      onCreateProject(formData);
    } else if (onAddToProject && projects?.length) {
      onAddToProject(projects[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    /* ★ translucent white backdrop instead of black ★ */
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
    >
      {/* ▼ CHANGED — pastel‑green background instead of white ▼ */}
      <div
        ref={modalRef}
        className="rounded-lg p-6 w-full max-w-md"
        style={{ backgroundColor: "#ECF9F2" }}   /* soft mint‑green */
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {onCreateProject ? "Create New Project" : "Save to Project"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        {onCreateProject ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter project title"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select a project to save to:</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {projects?.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onAddToProject?.(p.id)}
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <Button className="bg-[#FFFFFF] hover:bg-[#7DCCA0] text-black hover:text-white transition-colors" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#FFFFFF] hover:bg-[#7DCCA0] text-black hover:text-white transition-colors"
            onClick={handleSave}
          >
            {onCreateProject ? "Create Project" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
