import { DuvenbeckScoringCriteria } from '@/lib/priority-calculator';

// Helper functions to convert existing data to priority calculator format

export function mapIdeaToScoringCriteria(idea: any): DuvenbeckScoringCriteria {
  return {
    complexity: idea.complexity || 3, // Use existing complexity field
    cost: idea.cost || 3, // Use existing cost field
    roi: idea.roi || 3, // Use existing ROI field
    risk: idea.risk || 3, // Use existing risk field (assuming same scale)
    strategicAlignment: idea.strategicAlignment || 3 // Use strategic alignment or default
  };
}

export function enhanceIdeasForPriorityCalculator(ideas: any, departmentName: string) {
  // Handle both array format and nested object format
  const ideasArray = Array.isArray(ideas) ? ideas : ((ideas as any)?.ideas || []);
  
  return ideasArray.map((idea: any, index: number) => ({
    id: idea.ideaKey || `${departmentName}_${index}`,
    name: idea.ideaKey?.split('.').pop()?.replace(/_/g, ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || `Initiative ${index + 1}`,
    description: idea.problemKey || idea.solutionKey || 'AI Initiative',
    department: departmentName,
    scores: mapIdeaToScoringCriteria(idea)
  }));
}

// Convert department data files to calculator format
export function getAllIdeasForCalculator() {
  // Dynamic imports for all department data
  const departments = [
    { name: 'Accounting', module: () => import('@/data/accounting') },
    { name: 'Central Solution Design', module: () => import('@/data/central_solution_design') },
    { name: 'Compliance', module: () => import('@/data/compliance') },
    { name: 'Contract Logistics', module: () => import('@/data/contract_logistics') },
    { name: 'Controlling', module: () => import('@/data/controlling') },
    { name: 'Corporate Development', module: () => import('@/data/corp_dev') },
    { name: 'ESG', module: () => import('@/data/esg') },
    { name: 'HR', module: () => import('@/data/hr') },
    { name: 'IT Business Solutions', module: () => import('@/data/it_business_solution_road') },
    { name: 'IT Information Security', module: () => import('@/data/it_information_security') },
    { name: 'IT Platform Services', module: () => import('@/data/it_plataform_services_digital_workplace') },
    { name: 'IT Shared Services', module: () => import('@/data/it_shared_services') },
    { name: 'Marketing Communications', module: () => import('@/data/marketing_communications') },
    { name: 'QEHS', module: () => import('@/data/qehs') },
    { name: 'Road Sales', module: () => import('@/data/road_sales') },
    { name: 'Strategic KAM', module: () => import('@/data/strategic_kam') }
  ];

  // For now, let's create some sample data that matches the expected format
  const sampleIdeas = [
    {
      id: 'compliance_damage_claim_review',
      name: 'Damage Claim Review Automation',
      description: 'Automate damage claim review processes using AI',
      department: 'Compliance',
      scores: { complexity: 3, cost: 3, roi: 4, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'hr_cv_screening',
      name: 'CV Screening Automation', 
      description: 'Automated CV screening and candidate ranking',
      department: 'HR',
      scores: { complexity: 2, cost: 2, roi: 5, risk: 3, strategicAlignment: 3 }
    },
    {
      id: 'it_security_threat_detection',
      name: 'AI-Powered Threat Detection',
      description: 'Real-time security threat detection and response',
      department: 'IT Security',
      scores: { complexity: 4, cost: 4, roi: 5, risk: 2, strategicAlignment: 5 }
    },
    {
      id: 'logistics_route_optimization',
      name: 'Dynamic Route Optimization',
      description: 'AI-driven route optimization for logistics operations',
      department: 'Logistics',
      scores: { complexity: 3, cost: 3, roi: 5, risk: 2, strategicAlignment: 5 }
    },
    {
      id: 'finance_invoice_processing',
      name: 'Automated Invoice Processing',
      description: 'OCR and AI for automated invoice data extraction',
      department: 'Finance',
      scores: { complexity: 2, cost: 2, roi: 4, risk: 3, strategicAlignment: 4 }
    },
    {
      id: 'sales_lead_scoring',
      name: 'Intelligent Lead Scoring',
      description: 'AI-based lead scoring and qualification system',
      department: 'Sales',
      scores: { complexity: 3, cost: 3, roi: 4, risk: 3, strategicAlignment: 4 }
    },
    {
      id: 'operations_predictive_maintenance',
      name: 'Predictive Maintenance System',
      description: 'Predict equipment failures before they occur',
      department: 'Operations',
      scores: { complexity: 4, cost: 4, roi: 5, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'customer_service_chatbot',
      name: 'Customer Service AI Chatbot',
      description: 'Intelligent chatbot for customer support automation',
      department: 'Customer Service',
      scores: { complexity: 2, cost: 3, roi: 3, risk: 3, strategicAlignment: 3 }
    },
    {
      id: 'quality_defect_detection',
      name: 'Quality Control AI Vision',
      description: 'Computer vision for automated quality defect detection',
      department: 'Quality',
      scores: { complexity: 4, cost: 4, roi: 4, risk: 3, strategicAlignment: 4 }
    },
    {
      id: 'procurement_spend_analysis',
      name: 'Procurement Spend Analytics',
      description: 'AI-driven procurement spend analysis and optimization',
      department: 'Procurement',
      scores: { complexity: 3, cost: 2, roi: 4, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'marketing_content_generation',
      name: 'AI Content Generation',
      description: 'Automated marketing content creation and optimization',
      department: 'Marketing',
      scores: { complexity: 2, cost: 2, roi: 3, risk: 4, strategicAlignment: 3 }
    },
    {
      id: 'compliance_document_review',
      name: 'Compliance Document Review',
      description: 'AI-assisted regulatory document analysis and compliance checking',
      department: 'Compliance',
      scores: { complexity: 4, cost: 3, roi: 4, risk: 1, strategicAlignment: 5 }
    }
  ];
  
  return sampleIdeas;
}