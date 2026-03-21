"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideFilePlus } from "lucide-react";
import axiosInstance from "@/src/utils/axiosInstance";
import toast from "react-hot-toast";

// 1. Define Interfaces for Type Safety
interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  thumbnailLink?: string;
  completion?: number;
  fullName: string;
  designation: string;
  summary: string;
  email: string;
  phone: string;
  skills?: any[];
  education?: any[];
  workExperience?: any[];
  projects?: any[];
}

// Components - Ensure these are typed as React.FC or similar
import DashboardLayout from "@/app/components/DashboardLayout";
import Modal from "@/app/components/Modal";
import CreateResumeForm from "@/app/components/CreateResumeForm";
import { ResumeSummaryCard } from "@/app/components/Cards";

const Dashboard: React.FC = () => {
  const router = useRouter();

  // 2. Explicitly type your State hooks
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [allResumes, setAllResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Type the parameter and return value of the logic functions
  const calculateCompletion = (resume: any): number => {
    let completedFields = 0;
    const sections = [
        resume.fullName,
        resume.designation,
        resume.summary,
        resume.email,
        resume.phone,
        resume.skills && resume.skills.length > 0,
        resume.education && resume.education.length > 0,
        resume.workExperience && resume.workExperience.length > 0,
        resume.projects && resume.projects.length > 0
    ];

    sections.forEach(field => {
        if (field) completedFields++;
    });

    return Math.round((completedFields / sections.length) * 100);
  };

  useEffect(() => {
    fetchAllResumes();
  }, []);

  const fetchAllResumes = async () => {
    setLoading(true);
    setError(null);
    try {
        // HTTP-only cookie is sent automatically by fetch
        const response = await fetch("/api/resumes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            // If status is 400 or 401, this will catch it
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch resumes");
        }

        const data: ResumeData[] = await response.json();

        const resumeWithCompletion = data.map((resume: ResumeData) => ({
            ...resume,
            completion: calculateCompletion(resume),
        }));

        setAllResumes(resumeWithCompletion);
    } catch (err: any) {
        console.error("Error fetching resumes:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  const handleDeleteResume = async (): Promise<void> => {
    if (!resumeToDelete) return;
    try {
      await axiosInstance.delete(`/api/resumes/${resumeToDelete}`);
      toast.success("Resume deleted");
      fetchAllResumes();
    } catch (_error: any) {
      toast.error("Failed to delete");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <DashboardLayout activeMenu="dashboard">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Resumes</h1>
            <p className="text-gray-400">
              {allResumes.length > 0
                ? `You have ${allResumes.length} resumes`
                : `Start building your career`}
            </p>
          </div>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition"
          >
            Create Now <LucideFilePlus size={18} />
          </button>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
                {error}
            </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              onClick={() => setOpenCreateModal(true)}
              className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-10 cursor-pointer hover:border-violet-500 transition group"
            >
              <LucideFilePlus
                size={40}
                className="text-gray-500 group-hover:text-violet-500 mb-2"
              />
              <p className="text-gray-400 group-hover:text-violet-500 font-medium">
                New Resume
              </p>
            </div>

            {allResumes.map((resume) => (
              <ResumeSummaryCard
                key={resume.id}
                imgUrl={resume.thumbnailLink || ""}
                title={resume.title}
                updatedAt={resume.updatedAt}
                completion={resume.completion || 0}
                onSelect={() => router.push(`/editor/${resume.id}`)}
                onDelete={() => {
                  setResumeToDelete(resume.id);
                  setShowDeleteConfirm(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title="Create New Resume"
        hideHeader={false}
        showActionBtn={false}
        actionBtnText = "Submit"
      >
        <CreateResumeForm
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllResumes();
          }}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Resume"
        hideHeader={false}
        showActionBtn={true}
        actionBtnText="Delete"
        onActionClick={handleDeleteResume}
      >
        <div className="p-4 text-white">
          <p>Are you sure you want to delete this resume? This action cannot be undone.</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
