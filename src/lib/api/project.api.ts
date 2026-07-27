import {
  BudgetResponse,
  ChecklistItemResponse,
  MaterialWithdrawalResponse,
  ProjectMaterialResponse,
  ProjectResponse
} from './api.type';
import { authFetch } from './auth-fetch';
import {
  AddProjectMaterialInput,
  CreateChecklistItemInput,
  CreateProjectInput,
  UpdateChecklistItemInput,
  UpdateProjectMaterialInput,
  WithdrawMaterialInput
} from '../schemas/project.schema';

export const ProjectApi = {
  async create(data: CreateProjectInput) {
    return authFetch<ProjectResponse>('/projects', {
      method: 'POST',
      body: data
    });
  },

  async getMine() {
    return authFetch<ProjectResponse[]>('/projects');
  },

  async getPendingRequests() {
    return authFetch<ProjectResponse[]>('/projects/requests');
  },

  async getManaged() {
    return authFetch<ProjectResponse[]>('/projects/managed');
  },

  async getById(projectId: string) {
    return authFetch<ProjectResponse>(`/projects/${projectId}`);
  },

  async accept(projectId: string) {
    return authFetch<ProjectResponse>(`/projects/${projectId}/accept`, {
      method: 'PATCH'
    });
  },

  // --- Material planning ---

  async addMaterial(projectId: string, data: AddProjectMaterialInput) {
    return authFetch<ProjectMaterialResponse>(
      `/projects/${projectId}/materials`,
      { method: 'POST', body: data }
    );
  },

  async getMaterials(projectId: string) {
    return authFetch<ProjectMaterialResponse[]>(
      `/projects/${projectId}/materials`
    );
  },

  async updateMaterial(
    projectId: string,
    materialId: string,
    data: UpdateProjectMaterialInput
  ) {
    return authFetch<ProjectMaterialResponse>(
      `/projects/${projectId}/materials/${materialId}`,
      { method: 'PATCH', body: data }
    );
  },

  async removeMaterial(projectId: string, materialId: string) {
    return authFetch<{ message: string }>(
      `/projects/${projectId}/materials/${materialId}`,
      { method: 'DELETE' }
    );
  },

  // --- Material withdrawal ---

  async withdrawMaterial(
    projectId: string,
    materialId: string,
    data: WithdrawMaterialInput
  ) {
    return authFetch<MaterialWithdrawalResponse>(
      `/projects/${projectId}/materials/${materialId}/withdraw`,
      { method: 'POST', body: data }
    );
  },

  async getWithdrawals(projectId: string, materialId: string) {
    return authFetch<MaterialWithdrawalResponse[]>(
      `/projects/${projectId}/materials/${materialId}/withdrawals`
    );
  },

  // --- Progress checklist ---

  async addChecklistItem(projectId: string, data: CreateChecklistItemInput) {
    return authFetch<ChecklistItemResponse>(
      `/projects/${projectId}/checklist`,
      { method: 'POST', body: data }
    );
  },

  async getChecklist(projectId: string) {
    return authFetch<ChecklistItemResponse[]>(
      `/projects/${projectId}/checklist`
    );
  },

  async updateChecklistItem(
    projectId: string,
    itemId: string,
    data: UpdateChecklistItemInput
  ) {
    return authFetch<ChecklistItemResponse>(
      `/projects/${projectId}/checklist/${itemId}`,
      { method: 'PATCH', body: data }
    );
  },

  async toggleChecklistItem(
    projectId: string,
    itemId: string,
    isCompleted: boolean
  ) {
    return authFetch<ChecklistItemResponse>(
      `/projects/${projectId}/checklist/${itemId}/complete`,
      { method: 'PATCH', body: { isCompleted } }
    );
  },

  async removeChecklistItem(projectId: string, itemId: string) {
    return authFetch<{ message: string }>(
      `/projects/${projectId}/checklist/${itemId}`,
      { method: 'DELETE' }
    );
  },

  async uploadChecklistItemPhotos(
    projectId: string,
    itemId: string,
    files: File[]
  ) {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    return authFetch<ChecklistItemResponse>(
      `/projects/${projectId}/checklist/${itemId}/photos`,
      { method: 'POST', body: formData }
    );
  },

  // --- Budget tracking ---

  async getBudget(projectId: string) {
    return authFetch<BudgetResponse>(`/projects/${projectId}/budget`);
  }
};
