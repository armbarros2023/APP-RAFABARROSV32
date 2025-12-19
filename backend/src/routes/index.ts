import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as branchController from '../controllers/branchController';
import * as studentController from '../controllers/studentController';
import * as staffController from '../controllers/staffController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// ============================================
// PROTECTED ROUTES (require authentication)
// ============================================

// Current user
router.get('/auth/me', authMiddleware, authController.me);

// Branches
router.get('/branches', authMiddleware, branchController.getAllBranches);
router.get('/branches/:id', authMiddleware, branchController.getBranchById);
router.post('/branches', authMiddleware, adminOnly, branchController.createBranch);
router.put('/branches/:id', authMiddleware, adminOnly, branchController.updateBranch);
router.delete('/branches/:id', authMiddleware, adminOnly, branchController.deleteBranch);

// Students
router.get('/students', authMiddleware, studentController.getAllStudents);
router.get('/students/:id', authMiddleware, studentController.getStudentById);
router.post('/students', authMiddleware, studentController.createStudent);
router.put('/students/:id', authMiddleware, studentController.updateStudent);
router.delete('/students/:id', authMiddleware, adminOnly, studentController.deleteStudent);

// Staff/Therapists
router.get('/staff', authMiddleware, staffController.getAllStaff);
router.get('/staff/:id', authMiddleware, staffController.getStaffById);
router.post('/staff', authMiddleware, adminOnly, staffController.createStaff);
router.put('/staff/:id', authMiddleware, staffController.updateStaff);
router.delete('/staff/:id', authMiddleware, adminOnly, staffController.deleteStaff);

// TODO: Add more routes for:
// - Appointments
// - Financial Transactions
// - Student Invoices
// - Therapist Payments
// - Initial Assessments
// - Activity Logs
// - Media
// - External Activities

export default router;
