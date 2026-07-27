export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'CUSTOMER';

export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  access_token: string;
  user: UserResponse;
};

export type ProjectStatus =
  | 'REQUESTED'
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProjectResponse = {
  id: string;
  customerId: string;
  customerName: string;
  projectManagerId: string | null;
  projectManagerName: string | null;
  projectName: string;
  houseType: string;
  location: string;
  estimatedBudget: string;
  actualCost: string;
  status: ProjectStatus;
  description: string | null;
  progressPercent: number;
  currentStepTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MaterialResponse = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMaterialResponse = {
  id: string;
  projectId: string;
  materialId: string;
  materialName: string;
  unit: string;
  plannedQty: number;
  plannedUnitPrice: string;
  usedQty: number;
  createdAt: string;
  updatedAt: string;
};

export type MaterialWithdrawalResponse = {
  id: string;
  projectMaterialId: string;
  materialName: string;
  qty: number;
  unitPriceAtTime: string;
  withdrawnById: string;
  withdrawnByName: string;
  withdrawnAt: string;
};

export type ChecklistItemPhoto = {
  id: string;
  imageUrl: string;
  createdAt: string;
};

export type ChecklistItemResponse = {
  id: string;
  projectId: string;
  title: string;
  isCompleted: boolean;
  completedAt: string | null;
  completedById: string | null;
  completedByName: string | null;
  photos: ChecklistItemPhoto[];
  createdAt: string;
  updatedAt: string;
};

export type BudgetResponse = {
  estimatedBudget: string;
  actualCost: string;
  remainingBudget: string;
  usagePercent: number;
  isOverBudget: boolean;
};

export type DashboardResponse =
  | {
      role: 'ADMIN';
      totalUsers: number;
      totalProjects: number;
      projectsByStatus: Record<string, number>;
      totalMaterials: number;
      lowStockMaterials: number;
    }
  | {
      role: 'PROJECT_MANAGER' | 'CUSTOMER';
      totalProjects: number;
      projectsByStatus: Record<string, number>;
      totalEstimatedBudget: string;
      totalActualCost: string;
    };
