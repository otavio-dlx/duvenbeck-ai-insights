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

  // Comprehensive sample data representing AI initiatives across Duvenbeck departments
  const sampleIdeas = [
    // Compliance Department
    {
      id: 'compliance_damage_claim_automation',
      name: 'Damage Claim Processing Automation',
      description: 'Automated damage claim review and assessment using AI image recognition and natural language processing',
      department: 'Compliance',
      scores: { complexity: 3, cost: 3, roi: 4, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'compliance_regulatory_monitoring',
      name: 'Regulatory Compliance Monitoring',
      description: 'AI system to monitor regulatory changes and assess impact on operations',
      department: 'Compliance',
      scores: { complexity: 4, cost: 3, roi: 4, risk: 1, strategicAlignment: 5 }
    },
    {
      id: 'compliance_audit_automation',
      name: 'Audit Trail Automation',
      description: 'Automated compliance audit trail generation and anomaly detection',
      department: 'Compliance',
      scores: { complexity: 3, cost: 2, roi: 3, risk: 2, strategicAlignment: 4 }
    },
    
    // HR Department
    {
      id: 'hr_cv_screening_system',
      name: 'Intelligent CV Screening',
      description: 'AI-powered CV analysis and candidate ranking system for recruitment optimization',
      department: 'HR',
      scores: { complexity: 2, cost: 2, roi: 5, risk: 3, strategicAlignment: 3 }
    },
    {
      id: 'hr_employee_sentiment',
      name: 'Employee Sentiment Analysis',
      description: 'Real-time employee satisfaction monitoring through communication analysis',
      department: 'HR',
      scores: { complexity: 3, cost: 3, roi: 3, risk: 4, strategicAlignment: 3 }
    },
    {
      id: 'hr_training_personalization',
      name: 'Personalized Training Recommendations',
      description: 'AI-driven personalized learning paths and training recommendations for employees',
      department: 'HR',
      scores: { complexity: 3, cost: 3, roi: 4, risk: 2, strategicAlignment: 4 }
    },

    // IT & Technology
    {
      id: 'it_security_threat_detection',
      name: 'Advanced Threat Detection System',
      description: 'AI-powered cybersecurity threat detection and automated response system',
      department: 'IT Security',
      scores: { complexity: 4, cost: 4, roi: 5, risk: 2, strategicAlignment: 5 }
    },
    {
      id: 'it_infrastructure_optimization',
      name: 'Infrastructure Performance Optimization',
      description: 'AI-driven server and network performance optimization with predictive scaling',
      department: 'IT Operations',
      scores: { complexity: 4, cost: 3, roi: 4, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'it_help_desk_automation',
      name: 'IT Help Desk Automation',
      description: 'Intelligent chatbot and ticket routing system for IT support requests',
      department: 'IT Support',
      scores: { complexity: 2, cost: 2, roi: 4, risk: 3, strategicAlignment: 3 }
    },

    // Logistics & Operations
    {
      id: 'logistics_route_optimization',
      name: 'Dynamic Route Optimization',
      description: 'Real-time AI-driven route optimization considering traffic, weather, and delivery constraints',
      department: 'Logistics',
      scores: { complexity: 3, cost: 3, roi: 5, risk: 2, strategicAlignment: 5 }
    },
    {
      id: 'logistics_demand_forecasting',
      name: 'Demand Forecasting System',
      description: 'Predictive analytics for transportation demand and capacity planning',
      department: 'Logistics',
      scores: { complexity: 4, cost: 3, roi: 5, risk: 2, strategicAlignment: 5 }
    },
    {
      id: 'operations_predictive_maintenance',
      name: 'Predictive Vehicle Maintenance',
      description: 'IoT and AI system to predict vehicle maintenance needs and prevent breakdowns',
      department: 'Fleet Operations',
      scores: { complexity: 4, cost: 4, roi: 5, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'warehouse_automation',
      name: 'Warehouse Process Automation',
      description: 'AI-powered warehouse management with automated sorting and inventory tracking',
      department: 'Warehouse Operations',
      scores: { complexity: 5, cost: 5, roi: 4, risk: 3, strategicAlignment: 4 }
    },

    // Finance & Accounting
    {
      id: 'finance_invoice_processing',
      name: 'Intelligent Invoice Processing',
      description: 'OCR and AI for automated invoice data extraction, validation, and processing',
      department: 'Finance',
      scores: { complexity: 2, cost: 2, roi: 4, risk: 3, strategicAlignment: 4 }
    },
    {
      id: 'finance_fraud_detection',
      name: 'Financial Fraud Detection',
      description: 'Machine learning system to detect fraudulent transactions and expense claims',
      department: 'Finance',
      scores: { complexity: 3, cost: 3, roi: 4, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'finance_cash_flow_prediction',
      name: 'Cash Flow Prediction Model',
      description: 'Predictive analytics for cash flow forecasting and financial planning',
      department: 'Controlling',
      scores: { complexity: 3, cost: 2, roi: 4, risk: 2, strategicAlignment: 5 }
    },

    // Sales & Customer Management
    {
      id: 'sales_lead_scoring',
      name: 'Intelligent Lead Scoring System',
      description: 'AI-based lead qualification and sales opportunity ranking system',
      department: 'Sales',
      scores: { complexity: 3, cost: 3, roi: 4, risk: 3, strategicAlignment: 4 }
    },
    {
      id: 'sales_pricing_optimization',
      name: 'Dynamic Pricing Optimization',
      description: 'AI-driven pricing recommendations based on market conditions and competition',
      department: 'Sales',
      scores: { complexity: 4, cost: 3, roi: 5, risk: 3, strategicAlignment: 5 }
    },
    {
      id: 'customer_churn_prediction',
      name: 'Customer Churn Prediction',
      description: 'Predictive model to identify at-risk customers and retention opportunities',
      department: 'Customer Relations',
      scores: { complexity: 3, cost: 2, roi: 4, risk: 2, strategicAlignment: 4 }
    },

    // Quality & Safety
    {
      id: 'quality_defect_detection',
      name: 'Automated Quality Control',
      description: 'Computer vision system for automated quality defect detection in operations',
      department: 'Quality Management',
      scores: { complexity: 4, cost: 4, roi: 4, risk: 3, strategicAlignment: 4 }
    },
    {
      id: 'safety_incident_prediction',
      name: 'Safety Incident Prediction',
      description: 'AI system to predict and prevent workplace safety incidents',
      department: 'QEHS',
      scores: { complexity: 4, cost: 3, roi: 5, risk: 1, strategicAlignment: 5 }
    },

    // Procurement & Supply Chain
    {
      id: 'procurement_spend_analysis',
      name: 'Procurement Spend Analytics',
      description: 'AI-driven spend analysis and supplier performance optimization',
      department: 'Procurement',
      scores: { complexity: 3, cost: 2, roi: 4, risk: 2, strategicAlignment: 4 }
    },
    {
      id: 'supplier_risk_assessment',
      name: 'Supplier Risk Assessment',
      description: 'Automated supplier risk evaluation and supply chain resilience monitoring',
      department: 'Procurement',
      scores: { complexity: 3, cost: 3, roi: 3, risk: 2, strategicAlignment: 4 }
    },

    // Marketing & Communications
    {
      id: 'marketing_content_generation',
      name: 'AI-Powered Content Creation',
      description: 'Automated marketing content generation and campaign optimization',
      department: 'Marketing',
      scores: { complexity: 2, cost: 2, roi: 3, risk: 4, strategicAlignment: 3 }
    },
    {
      id: 'marketing_customer_segmentation',
      name: 'Advanced Customer Segmentation',
      description: 'AI-driven customer segmentation for personalized marketing campaigns',
      department: 'Marketing',
      scores: { complexity: 3, cost: 2, roi: 4, risk: 3, strategicAlignment: 3 }
    }
  ];
  
  return sampleIdeas;
}