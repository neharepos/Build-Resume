"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideFilePlus, LucideTrash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

// 1. Define Interfaces for Type Safety
interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  thumbnailLink?: string;
  completion?: number;
  profileInfo?: {
    fullName: string;
    designation: string;
    summary: string;
  };
  contactInfo?: {
    email: string;
    phone: string;
  };
  // Add other sections as needed
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
  const calculateCompletion = (resume: ResumeData): number => {
    let completedFields = 0;
    let totalFields = 5; // Base fields for Profile + Contact

    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    return totalFields > 0
      ? Math.round((completedFields / totalFields) * 100)
      : 0;
  };

  const fetchAllResumes = async () => {
    setLoading(true);
    setError(null);
    try {
        // 1. Get the token (same way we do in UserContext)
        const token = localStorage.getItem('token');

        // 2. Use fetch with the Authorization header
        const response = await fetch("/api/resumes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
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
      await axios.delete(`/api/resumes/${resumeToDelete}`);
      toast.success("Resume deleted");
      fetchAllResumes();
    } catch (error: any) {
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
        title="Create New Resume" // Added this
        hideHeader={false} // Added this
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
    </DashboardLayout>
  );
};

export default Dashboard;
