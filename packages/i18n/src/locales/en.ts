/**
 * 英文翻译资源
 */
import type { TranslationSchema } from "./zh.js";

export const en: TranslationSchema = {
  translation: {
    brand: "TestOps AI",
    common: {
      loading: "Loading...",
      cancel: "Cancel",
      delete: "Delete",
      remove: "Remove",
      add: "Add",
      save: "Save",
      saveChanges: "Save Changes",
      confirm: "Confirm",
      auto: "Auto",
      light: "Light",
      dark: "Dark",
      member: "Member",
      owner: "Owner",
      workspaceLabel: "Workspace",
      notFound: "not found",
      saveSuccess: "Saved successfully",
      saveFailed: "Failed to save",
      deleteSuccess: "Deleted",
      deleteFailed: "Failed to delete",
      severity: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low"
      },
      theme: {
        light: "Light",
        dark: "Dark"
      }
    },
    userMenu: {
      account: "Account",
      admin: "Admin",
      signOut: "Sign out"
    },
    userSettings: {
      title: "Account Settings",
      profileTab: "Profile",
      passwordTab: "Password",
      uploadAvatar: "Upload avatar",
      removeAvatar: "Remove avatar",
      avatarRemoved: "Avatar removed",
      pleaseUploadImage: "Please upload an image file",
      settingsSaved: "Settings saved",
      passwordChanged: "Password changed successfully",
      userName: "User name",
      userNameRequired: "Please enter a user name",
      userNamePlaceholder: "e.g. Chen Wei",
      email: "Email",
      emailRequired: "Please enter your email",
      language: "Language",
      theme: "Theme",
      currentPassword: "Current Password",
      currentPasswordRequired: "Please enter current password",
      currentPasswordPlaceholder: "Enter current password",
      newPassword: "New Password",
      newPasswordRequired: "Please enter new password",
      newPasswordMin: "Password must be at least 6 characters",
      newPasswordPlaceholder: "Enter new password (min 6 chars)",
      confirmPassword: "Confirm New Password",
      confirmPasswordRequired: "Please confirm new password",
      confirmPasswordPlaceholder: "Confirm new password",
      passwordMismatch: "Passwords do not match",
      changePassword: "Change Password"
    },
    createWorkspace: {
      title: "Create Workspace",
      success: "Workspace created successfully",
      failed: "Failed to create",
      create: "Create",
      cancel: "Cancel",
      nameLabel: "Workspace Name",
      nameRequired: "Please enter workspace name",
      nameLength: "Name length should be 1-50 characters",
      namePlaceholder: "e.g., My Project",
      slugLabel: "Workspace Slug (URL)",
      slugRequired: "Please enter slug",
      slugPattern: "Only lowercase letters, numbers and hyphens allowed",
      slugExtra: "Used for access URL, e.g., /dashboard/{{slug}}",
      descLabel: "Description",
      descPlaceholder: "Brief description of this workspace..."
    },
    nav: {
      items: [
        { label: "Home", href: "/#home" },
        { label: "Solutions", href: "/#solutions" },
        { label: "Workflow", href: "/#workflow" },
        { label: "AI Core", href: "/#ai" },
        { label: "Plans", href: "/#plans" }
      ],
      login: "Sign in",
      dashboard: "Console"
    },
    hero: {
      badge: "AI TestOps",
      title: "AI-first TestOps Platform",
      subtitle:
        "From requirement intake to test execution and reporting. Make testing observable, measurable, and automated like DevOps.",
      primary: "Book a demo",
      secondary: "View architecture",
      consoleTitle: "Live quality command",
      consoleLines: [
        "✓ Requirements parsed · 12 scenarios",
        "✓ Test matrix generated · 92% coverage",
        "→ Regression scheduled · 18/24",
        "→ Release gate scoring · 8% risk"
      ],
      metrics: [
        { label: "End-to-end automation", value: "90%" },
        { label: "Delivery visibility", value: "100%" },
        { label: "Efficiency uplift", value: "3x" }
      ]
    },
    overview: {
      title: "Make testing the core engine of delivery",
      description:
        "TestOps AI orchestrates quality with AI: requirement understanding, test design generation, execution loops, risk prediction, and reporting insights.",
      cards: [
        {
          title: "AI-first TestOps",
          desc: "Requirements, design, execution, and reporting run on one AI-driven pipeline with full observability.",
          bullets: [
            "Auto-generate scope and coverage suggestions",
            "Reusable test knowledge base",
            "One-click quality gates and dashboards"
          ]
        },
        {
          title: "Unified quality operations",
          desc: "Manual and automation testing, defects, risks, and efficiency metrics in one view.",
          bullets: [
            "Live progress and blocker detection",
            "Defect trends and regression priority",
            "Continuous quality KPI optimization"
          ]
        }
      ]
    },
    pillars: {
      title: "Capability matrix",
      items: [
        {
          title: "Requirement-led",
          desc: "Generate scope and coverage from PRD or user stories."
        },
        {
          title: "Smart design",
          desc: "Auto-generate cases, data, and assertions with templates."
        },
        {
          title: "Execution orchestration",
          desc: "Unified schedules for manual and automation with live updates."
        },
        {
          title: "Quality insights",
          desc: "Risk heatmap, defect trend, coverage, and quality gates."
        },
        {
          title: "Knowledge accumulation",
          desc: "Turn test assets into a continuous quality knowledge base."
        },
        {
          title: "Governance",
          desc: "Audit trails, permissions, and traceability."
        }
      ]
    },
    flow: {
      title: "Full-cycle TestOps workflow",
      steps: [
        {
          title: "Requirement intake",
          desc: "Ingest tickets, PRDs, and API docs to build scope."
        },
        {
          title: "Planning",
          desc: "AI generates test matrix, risk grading, and resourcing."
        },
        {
          title: "Design",
          desc: "Generate cases, data, and scripts from models and history."
        },
        {
          title: "Execution",
          desc: "Orchestrate automation, manual, performance, security."
        },
        {
          title: "Defects",
          desc: "Cluster, analyze root cause, and prioritize regressions."
        },
        {
          title: "Reporting",
          desc: "Auto-generate quality reports and release gates."
        }
      ]
    },
    testing: {
      badge: "AI-Powered Testing",
      title: "Intelligent Planning, Full Coverage",
      desc: "AI automatically analyzes requirements and generates test plans, supporting multiple testing protocols and platforms for comprehensive testing needs",
      capabilities: [
        {
          title: "HTTP / REST API",
          desc: "Comprehensive HTTP API testing with RESTful, GraphQL, and WebSocket support"
        },
        {
          title: "gRPC",
          desc: "High-performance gRPC service testing with Unary and Streaming calls"
        },
        {
          title: "Mobile UI",
          desc: "iOS / Android native app automation on real devices and simulators"
        },
        {
          title: "Browser Testing",
          desc: "Cross-browser automation for Chrome / Firefox / Safari / Edge"
        },
        {
          title: "Windows Desktop",
          desc: "Windows desktop automation with WinUI / WPF / Win32 support"
        },
        {
          title: "AI Planning",
          desc: "Auto-generate test cases from requirements with intelligent scenario and boundary detection"
        }
      ]
    },
    ai: {
      title: "AI-first core capabilities",
      items: [
        {
          title: "Requirement intelligence",
          desc: "Extract scenarios and risks from product context."
        },
        {
          title: "Asset generation",
          desc: "Generate cases, data, API scripts, and test notes."
        },
        {
          title: "Execution copilot",
          desc: "Diagnose blockers and prioritize regression paths."
        },
        {
          title: "Insightful reporting",
          desc: "Executive-ready reports and release recommendations."
        }
      ]
    },
    integrations: {
      title: "Integrations with your stack",
      items: [
        "Jira / Tapd / Feishu",
        "GitHub / GitLab / Azure DevOps",
        "Jenkins / GitHub Actions / Argo",
        "Postman / Playwright / Cypress",
        "SonarQube / Sentry / Datadog",
        "Enterprise chat & notification hubs"
      ]
    },
    security: {
      title: "Enterprise-grade security",
      items: [
        "Role-based access and org isolation",
        "Encryption and audit logging",
        "Multi-region deployment",
        "Compliance workflows & gates",
        "Asset versioning & approvals"
      ]
    },
    cta: {
      title: "Build AI-driven testing operations",
      desc: "Make QA the strategic engine for delivery.",
      primary: "Get a plan",
      secondary: "Start trial"
    },
    closing: {
      title: "Let testing evolve like code",
      subtitle: "AI TestOps · Align requirements, quality, and delivery in every iteration"
    },
    login: {
      title: "Sign in to TestOps AI",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      loading: "Signing in...",
      invitedRegister: "You have been invited, please register",
      firstAdmin: "Create the first admin account",
      pleaseLogin: "Please sign in to your account",
      userName: "User name",
      userNameRequired: "Please enter your name",
      userNamePlaceholder: "e.g. Alex",
      register: "Register",
      noAccount: "No account? Register",
      hasAccount: "Already have an account? Login",
      registrationDisabled: "Registration is currently disabled",
      backToLogin: "Back to login"
    },
    dashboard: {
      title: "TestOps Command Center",
      welcome: "Welcome back",
      stats: ["Requirement backlog", "Active test runs", "Release gates"],
      promptTitle: "Please sign in",
      promptBody: "Sign in to view your operational insights.",
      toLogin: "Go to sign in",
      workspace: "Workspace",
      workspaceSwitcher: {
        switchWorkspace: "Switch Workspace"
      },
      insightTitle: "Quality insights",
      insightDesc: "Auto-generated risk heatmaps, coverage, and gate recommendations.",
      insightItems: ["Coverage 92%", "Regression risk 8%", "Blockers 3", "Pending 5"],
      assistantTitle: "AI execution copilot",
      assistantDesc: "Detect blockers, suggest fixes, and prioritize regression paths.",
      assistantItems: [
        "Login flow anomaly detected; prioritize regression",
        "Payment API coverage dropped by 12%",
        "Mobile regression defect convergence up 20%"
      ],
      menu: {
        workbench: "Workbench",
        requirements: "Test Requirements",
        testPlan: "Test Plans",
        testDesign: {
          _: "Test Design",
          caseLibrary: "Case Library",
          caseReview: "Case Review",
          dataManagement: {
            _: "Data Management",
            testData: "Test Data",
            mockData: "Mock Data",
          },
        },
        execution: {
          _: "Execution",
          center: "Execution Center",
          history: "Execution History",
        },
        defects: "Defects & Risk",
        reports: "Quality Reports",
        automation: "Automation Assets",
        settings: "Settings",
        todolist: "📋 Todo List",
      },
      todoList: {
        title: "📋 Development Todo List",
        subtitle: "Workspace switching feature progress",
        currentWorkspace: "Current workspace",
        addPlaceholder: "Add new task...",
        completed: "completed",
        summary: "🎯 Completion Summary",
        noTodos: "No todos yet",
        menuLabel: "📋 Todo List"
      },
      defects: {
        description: "Track defects and assess risks"
      },
      testDesign: {
        description: "Design and write test cases",
        caseLibrary: "Test Case Library",
        newCase: "+ New Case",
        totalCases: "{{count}} test cases total"
      },
      settings: {
        title: "Workspace Settings",
        subtitle: "Manage \"{{name}}\" configuration and members",
        workspaceNotFound: "Workspace not found",
        generalTab: "General",
        membersTab: "Members",
        dangerTab: "Danger Zone",
        workspaceName: "Workspace Name",
        workspaceNamePlaceholder: "e.g., My Project",
        workspaceNameRequired: "Please enter name",
        workspaceNameLength: "Name length should be 1-50 characters",
        workspaceSlug: "Workspace Slug (URL)",
        workspaceSlugRequired: "Please enter slug",
        workspaceSlugPattern: "Only lowercase letters, numbers and hyphens allowed",
        workspaceSlugExtra: "Used in URL, e.g., /dashboard/my-project",
        description: "Description",
        descriptionPlaceholder: "Briefly describe this workspace...",
        workspaceDeleted: "Workspace deleted",
        confirmDeleteTitle: "Confirm Delete Workspace",
        confirmDeleteContent: "Are you sure you want to delete workspace \"{{name}}\"? This action cannot be undone.",
        confirmDeleteWarning: "All related data (including todos) will be permanently deleted.",
        confirmDeleteOk: "Delete",
        deleteWorkspace: "Delete Workspace",
        deleteWorkspaceDesc: "Once deleted, all data will be permanently removed and cannot be recovered.",
        memberList: "Team Members",
        memberListDesc: "Manage workspace members and permissions",
        inviteMember: "Invite Member",
        inviteModalTitle: "Invite Member",
        sendInvite: "Send Invite",
        emailAddress: "Email Address",
        emailRequired: "Please enter email",
        emailInvalid: "Please enter valid email",
        role: "Role",
        memberDefault: "Member (Default)",
        memberPermissionDesc: "Members can view and edit workspace content",
        tableColumnMember: "Member",
        tableColumnRole: "Role",
        tableColumnJoined: "Joined",
        tableColumnActions: "Actions",
        removeMemberComingSoon: "Remove member feature coming soon",
        inviteComingSoon: "Invite feature coming soon: Will send invitation to {{email}}",
        workspaceOwner: "Workspace Owner"
      },
      requirements: {
        description: "Manage and track product requirements",
        workspaceLabel: "Workspace",
        toAnalyze: "To Analyze",
        inDesign: "In Design",
        completed: "Completed",
        recentRequirements: "Recent Requirements",
        sampleTitle1: "User login optimization",
        sampleTitle2: "Payment API upgrade",
        sampleTitle3: "Order query optimization"
      },
      execution: {
        description: "Execute tests and view results",
        workspaceLabel: "Workspace",
        running: "Running",
        passed: "Passed",
        failed: "Failed",
        blocked: "Blocked"
      },
      automation: {
        description: "Manage automated test scripts and resources",
        workspaceLabel: "Workspace",
        totalScripts: "Total Scripts",
        successRate: "Success Rate",
        avgDuration: "Avg Duration"
      },
      reports: {
        description: "View quality metrics and generate reports",
        workspaceLabel: "Workspace",
        testCoverage: "Test Coverage",
        defectDensity: "Defect Density",
        automationRate: "Automation Rate"
      },
      testPlan: {
        description: "Plan and manage test plans",
        workspaceLabel: "Workspace",
        inProgress: "In Progress",
        completedThisWeek: "Completed This Week",
        avgCoverage: "Avg Coverage"
      },
      testRequirements: {
        titleTotal: "Total",
        titleDraft: "Draft",
        titleInProgress: "In Progress",
        titleDone: "Completed",
        searchPlaceholder: "Search requirements...",
        filterStatus: "Status",
        filterType: "Type",
        filterPriority: "Priority",
        refresh: "Refresh",
        create: "New Requirement",
        totalCount: "{{total}} items",
        view: "View",
        edit: "Edit",
        remove: "Delete",
        removeTitle: "Delete this requirement?",
        removeDesc: "This action cannot be undone",
        removeOk: "Delete",
        removeCancel: "Cancel",
        modalCreate: "Create Test Requirement",
        modalEdit: "Edit Test Requirement",
        modalOkCreate: "Create",
        modalOkSave: "Save",
        fieldTitle: "Title",
        fieldTitleRequired: "Please enter a title",
        fieldType: "Type",
        fieldDesc: "Description",
        fieldContent: "Details (Markdown)",
        fieldPriority: "Priority",
        fieldStatus: "Status",
        fieldDueDate: "Due Date",
        dueDatePlaceholder: "Select due date",
        fieldEstimate: "Estimated Hours",
        fieldTags: "Tags (comma separated)",
        tagsPlaceholder: "tag1, tag2, tag3",
        detailTabInfo: "Overview",
        detailTabContent: "Details",
        detailTabChildren: "Sub-requirements",
        descEmpty: "No description",
        contentEmpty: "No details",
        childrenEmpty: "No sub-requirements",
        childrenCount: "{{count}} sub-requirements",
        creator: "Creator",
        assignee: "Assignee",
        estimate: "Estimated",
        actual: "Actual",
        createdAt: "Created",
        dueDate: "Due",
        hours: "h",
        children: "Sub",
        requirementId: "ID",
        requirementName: "Title",
        type: "Type",
        status: "Status",
        priority: "Priority",
        creatorName: "Creator",
        assigneeName: "Assignee",
        createdTime: "Created",
        action: "Actions",
        toastCreateSuccess: "Created successfully",
        toastCreateFail: "Create failed",
        toastUpdateSuccess: "Updated successfully",
        toastUpdateFail: "Update failed",
        toastDeleteSuccess: "Deleted successfully",
        toastDeleteFail: "Delete failed",
        markdownPlaceholder: "# Test Requirement Details\n\n## Objective\nDescribe the test objective...\n\n## Scope\n- Scope item 1\n- Scope item 2\n\n## Steps\n1. Step one\n2. Step two\n\n## Expected Result\nDescribe expected results...",
        statusLabels: {
          draft: "Draft",
          pending: "Pending",
          approved: "Approved",
          in_progress: "In Progress",
          completed: "Completed",
          rejected: "Rejected",
          cancelled: "Cancelled"
        },
        typeLabels: {
          functional: "Functional",
          performance: "Performance",
          security: "Security",
          usability: "Usability",
          compatibility: "Compatibility",
          integration: "Integration",
          regression: "Regression"
        },
        priorityLabels: {
          critical: "Critical",
          high: "High",
          medium: "Medium",
          low: "Low"
        }
      }
    },
    aiWorkflow: {
      aiAutoProcess: "AI Fully Automated",
      upload: {
        title: "Upload Requirements",
        desc: "Drag files here, or click to browse",
        selectFile: "Select File",
        sampleFile: "E-commerce Platform Requirements v3.2.pdf",
        sampleMeta: "3.8 MB · 156 pages · Includes API docs"
      },
      analyzing: {
        title: "AI Analyzing Requirements",
        desc: "Deep parsing document structure, identifying modules & test points",
        docStructure: "Document Structure Analysis",
        modules: [
          "1. User Management",
          "2. Product Management",
          "3. Order Processing",
          "4. Payment Gateway",
          "5. Logistics Tracking"
        ],
        stats: [
          { label: "Modules", value: "28" },
          { label: "Test Points", value: "186" },
          { label: "Boundaries", value: "42" },
          { label: "API Endpoints", value: "67" }
        ],
        progress: "Analysis Progress",
        analyzing: "Analyzing..."
      },
      testPlan: {
        title: "AI Creating Test Plan",
        desc: "Intelligent test strategy & priority planning based on requirements",
        complete: "Complete",
        testCases: "Test Cases",
        modules: [
          {
            module: "User Mgmt",
            priority: "High",
            items: ["Login/Register", "Access Control", "Profile", "OAuth"]
          },
          {
            module: "Orders",
            priority: "High",
            items: ["Create Order", "Status Flow", "Refunds", "Concurrency"]
          },
          {
            module: "Payment",
            priority: "Critical",
            items: ["Alipay", "WeChat Pay", "Bank Card", "Refund Logic"]
          },
          {
            module: "Products",
            priority: "Medium",
            items: ["CRUD", "Inventory", "Pricing", "Categories"]
          },
          {
            module: "Logistics",
            priority: "Medium",
            items: ["Tracking", "Status Sync", "Exceptions", "Multi-channel"]
          },
          {
            module: "API Gateway",
            priority: "High",
            items: ["Rate Limit", "Auth", "Logging", "Versioning"]
          }
        ]
      },
      generate: {
        title: "AI Generating Test Cases",
        desc: "Smart scenario detection, auto-generate boundary condition cases",
        page: "Page",
        step1: "Smart Scenario Detection",
        step2: "Auto-detect Boundary Conditions",
        step3: "HTTP / REST API Case Generation",
        step4: "Browser UI Test Case Generation",
        step5: "Mobile UI Test Case Generation",
        step6: "Case Generation Complete",
        scenarios: [
          { scenario: "Positive Flow", desc: "Login → Browse → Add to Cart → Checkout" },
          { scenario: "Exception Flow", desc: "Network interruption, timeout retry, concurrency" },
          { scenario: "Boundary Testing", desc: "Max quantity, price limits, inventory threshold" },
          { scenario: "Security Testing", desc: "SQL injection, XSS, privilege escalation" }
        ],
        boundaries: [
          { field: "Username", min: "2 chars", max: "32 chars", special: "Special char filter" },
          { field: "Password", min: "8 chars", max: "128 chars", special: "Strength check" },
          { field: "Price", min: "0.01", max: "999999.99", special: "Precision handling" },
          { field: "Quantity", min: "1", max: "9999", special: "Stock validation" },
          { field: "Coupon", min: "1", max: "Order amount", special: "Stacking rules" },
          { field: "Address", min: "10 chars", max: "200 chars", special: "Address parsing" }
        ],
        apis: [
          { method: "POST", path: "/api/v1/users/login", desc: "User login" },
          { method: "GET", path: "/api/v1/products", desc: "Product list" },
          { method: "POST", path: "/api/v1/orders", desc: "Create order" },
          { method: "PUT", path: "/api/v1/orders/:id/status", desc: "Update order status" },
          { method: "DELETE", path: "/api/v1/cart/items/:id", desc: "Remove cart item" }
        ],
        cases: "cases",
        browsers: [
          { browser: "Chrome", version: "v120+" },
          { browser: "Firefox", version: "v115+" },
          { browser: "Safari", version: "v17+" },
          { browser: "Edge", version: "v118+" }
        ],
        browserTests: ["Page Render", "Interaction Response", "Form Validation", "Cross-browser"],
        iosPlatform: "iOS Platform",
        androidPlatform: "Android Platform",
        iosDevices: ["iPhone 15 Pro", "iPhone 14", "iPad Pro", "iPad Air"],
        androidDevices: ["Pixel 8 Pro", "Samsung S24", "Xiaomi 14", "OPPO Find X7"],
        summary: {
          types: [
            { type: "API Tests", count: 562 },
            { type: "Browser UI", count: 438 },
            { type: "iOS Mobile", count: 128 },
            { type: "Android Mobile", count: 139 },
            { type: "Performance", count: 86 }
          ],
          total: "1,353",
          readyToExecute: "test cases generated, ready to execute"
        }
      },
      execute: {
        title: "AI Auto-executing Tests",
        desc: "Multi-protocol parallel execution with real-time monitoring",
        lanes: [
          { type: "HTTP / REST API", desc: "Full HTTP testing, RESTful & GraphQL support" },
          { type: "gRPC Services", desc: "High-performance gRPC testing, Unary / Streaming" },
          { type: "Browser Tests", desc: "Chrome / Firefox / Safari / Edge cross-browser" },
          { type: "iOS Mobile", desc: "iPhone / iPad real device & simulator" },
          { type: "Android Mobile", desc: "Pixel / Samsung / Xiaomi multi-device" }
        ],
        stats: [
          { label: "Total", value: "1,353" },
          { label: "Passed", value: "1,312" },
          { label: "Failed", value: "28" },
          { label: "Duration", value: "4m 32s" }
        ]
      },
      report: {
        title: "AI Generating Test Report",
        desc: "Intelligent analysis of results, visual report generation",
        complete: "Workflow Complete",
        metrics: [
          { label: "Pass Rate", value: "97.1%" },
          { label: "Coverage", value: "94.8%" },
          { label: "Total Cases", value: "1,353" },
          { label: "Defects", value: "28" }
        ],
        chartTitle: "Test Type Distribution",
        chartLabels: ["API", "UI", "iOS", "Android", "gRPC"],
        defectTitle: "Defect Distribution",
        defects: [
          { module: "Payment", count: 12, severity: "High" },
          { module: "Orders", count: 8, severity: "Medium" },
          { module: "Users", count: 5, severity: "Low" },
          { module: "Other", count: 3, severity: "Low" }
        ],
        browserRecording: "Browser Recording - Chrome",
        downloadReport: "Download Report",
        shareReport: "Share Report",
        timeSaved: "Total time 4m 32s · Saved 48+ hours of manual work"
      }
    },
    errors: {
      common: {
        unauthorized: "Not logged in",
        forbidden: "No permission to access",
        requestFailed: "Request failed",
        missingWorkspace: "Missing workspace parameter",
        workspaceForbidden: "No permission to access this workspace",
        adminRequired: "Admin permission required",
        superadminRequired: "Super admin permission required"
      },
      auth: {
        invalidCredentials: "Invalid email or password",
        defaultWorkspaceNotFound: "Default workspace not found",
        emailAlreadyRegistered: "Email already registered",
        registrationDisabled: "Registration is currently disabled",
        invitationInvalid: "Invitation code is invalid or already used",
        invitationExpired: "Invitation code has expired"
      },
      user: {
        notFound: "User not found",
        emailInUse: "Email already in use",
        wrongPassword: "Current password is incorrect"
      },
      workspace: {
        notFound: "Workspace not found",
        onlyOwnerCanUpdate: "Only the owner can update",
        onlyOwnerCanDelete: "Only the owner can delete",
        slugExists: "Slug already exists",
        slugReserved: "This slug is reserved by the system"
      },
      todo: {
        notFound: "Todo not found"
      },
      testRequirement: {
        notFound: "Test requirement not found",
        createFetchFailed: "Unable to query record after creation",
        updateFetchFailed: "Unable to query record after update",
        deleteChildrenFirst: "Please delete all child requirements first"
      }
    },
    footer: {
      copyright: "© 2026 TestOps AI. All rights reserved.",
      tagline: "AI-first testing operations platform"
    },
    systemSettings: {
      title: "System Settings",
      passwordMinLength: "Password must be at least 4 characters",
      fillAllFields: "Please fill in all fields",
      userNameColumn: "Name",
      emailColumn: "Email",
      roleColumn: "Role",
      lastLoginColumn: "Last Login",
      actionsColumn: "Actions",
      neverLogin: "Never",
      hoursUnit: "hours",
      newPasswordPlaceholder: "Enter new password (min 4 chars)",
      usernamePlaceholder: "Enter username",
      emailPlaceholder: "Enter email",
      passwordPlaceholder: "Enter password (min 4 chars)",
      generalTab: "General",
      usersTab: "User Management",
      allowRegistration: "Allow New User Registration",
      allowRegistrationDesc: "When disabled, new users cannot register",
      singleWorkspaceMode: "Single Workspace Mode",
      singleWorkspaceModeDesc: "When enabled, all users share one workspace and workspace ID is hidden from URL",
      userList: "User List",
      userRole: "Role",
      lastLoginAt: "Last Login",
      userCreatedAt: "Registered",
      userActions: "Actions",
      roleUser: "User",
      roleAdmin: "Admin",
      roleSuperAdmin: "Super Admin",
      changeRole: "Change Role",
      resetPassword: "Reset Password",
      deleteUser: "Delete User",
      confirmDelete: "Confirm Delete",
      confirmDeleteDesc: "Are you sure you want to delete user {{name}}? This action cannot be undone.",
      resetPasswordTitle: "Reset Password",
      resetPasswordDesc: "Set a new password for user {{name}}",
      newPassword: "New Password",
      saveSuccess: "Saved successfully",
      deleteSuccess: "Deleted successfully",
      resetSuccess: "Password reset successfully",
      addUser: "Add User",
      addUserTitle: "Add New User",
      addUserDesc: "Manually create a new user account",
      userName: "Name",
      userEmail: "Email",
      userPassword: "Password",
      userRoleSelect: "Select Role",
      addUserSuccess: "User created successfully",
      emailExists: "This email is already registered",
      invitationTab: "Invitations",
      generateInvitation: "Generate Invitation Link",
      invitationList: "Invitation Codes",
      invitationCode: "Code",
      invitationStatus: "Status",
      invitationCreatedAt: "Created",
      invitationExpiresAt: "Expires",
      invitationUsedBy: "Used By",
      invitationUsedAt: "Used At",
      invitationStatusUnused: "Unused",
      invitationStatusUsed: "Used",
      invitationStatusExpired: "Expired",
      invitationNeverExpire: "Never",
      invitationCopied: "Invitation link copied to clipboard",
      invitationGenerated: "Invitation link generated",
      invitationDeleted: "Invitation code deleted",
      copyInvitationLink: "Copy Link",
      deleteInvitation: "Delete",
      expiresInHours: "Expires in (hours)",
      noExpiration: "No expiration"
    }
  }
};
