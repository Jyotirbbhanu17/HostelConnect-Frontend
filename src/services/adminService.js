import { apiRequest } from "./api";

export const getAdminDashboardStats = () => {
    return apiRequest("/admin/dashboard/stats");
};

export const getAdminStudents = (params = {}) => {
    const query = new URLSearchParams();

    if (params.search) {
        query.append("search", params.search);
    }

    if (params.hostelYear) {
        query.append("hostelYear", params.hostelYear);
    }

    if (params.accountStatus) {
        query.append("accountStatus", params.accountStatus);
    }

    const queryString = query.toString();

    return apiRequest(
        `/admin/students${queryString ? `?${queryString}` : ""}`
    );
};

export const updateStudentStatus = (
    studentId,
    accountStatus
) => {
    return apiRequest(
        `/admin/students/${studentId}/status?accountStatus=${accountStatus}`,
        {
            method: "PUT",
        }
    );
};

export const importStudents = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest("/admin/students/import", {
        method: "POST",
        body: formData,
    });
};