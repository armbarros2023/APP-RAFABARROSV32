-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'THERAPIST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "cnpj" TEXT,
    "stateRegistration" TEXT,
    "email" TEXT,
    "responsible" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_members" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "secondaryEmail" TEXT,
    "phone" TEXT,
    "status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatarUrl" TEXT,
    "specialty" TEXT,
    "bankInfo" TEXT,
    "contractUrl" TEXT,
    "admissionDate" TIMESTAMP(3),
    "terminationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastActivityDate" TIMESTAMP(3),
    "wantsMonthlyNFe" BOOLEAN NOT NULL DEFAULT false,
    "rg" TEXT,
    "cpf" TEXT,
    "address" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "sessionsPerMonth" INTEGER,
    "monthlyValue" DOUBLE PRECISION,
    "paymentMethod" "PaymentMethod",
    "taxPercentage" DOUBLE PRECISION,
    "planObservations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "therapistId" TEXT,
    "studentId" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "studentName" TEXT NOT NULL,
    "therapistName" TEXT,
    "service" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "cancellationReason" TEXT,
    "cancelledBy" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "studentId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "taxPercentage" DOUBLE PRECISION,
    "type" "TransactionType" NOT NULL,
    "category" "FinancialCategory" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "nfeNumber" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_invoices" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "paymentLink" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapist_payments" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "therapistName" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "sessionsConducted" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "invoiceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapist_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initial_assessments" (
    "id" TEXT NOT NULL,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "guardianEmail" TEXT,
    "guardianPhone" TEXT,
    "branchId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "initial_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_activity_logs" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_media" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "expenses" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "branches_cnpj_key" ON "branches"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "staff_members_email_key" ON "staff_members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_cpf_key" ON "students"("cpf");

-- AddForeignKey
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "staff_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "staff_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_invoices" ADD CONSTRAINT "student_invoices_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_invoices" ADD CONSTRAINT "student_invoices_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapist_payments" ADD CONSTRAINT "therapist_payments_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "staff_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapist_payments" ADD CONSTRAINT "therapist_payments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initial_assessments" ADD CONSTRAINT "initial_assessments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initial_assessments" ADD CONSTRAINT "initial_assessments_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "staff_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initial_assessments" ADD CONSTRAINT "initial_assessments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_activity_logs" ADD CONSTRAINT "student_activity_logs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_activity_logs" ADD CONSTRAINT "student_activity_logs_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_media" ADD CONSTRAINT "student_media_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_media" ADD CONSTRAINT "student_media_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

