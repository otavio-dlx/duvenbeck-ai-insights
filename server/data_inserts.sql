--
-- PostgreSQL database dump
--

\restrict sfXqUZfCZBdUSnQE9qGCY87JwjXm01RwjaU7mKanIOONzxHs4mHPC193jcL5NfC

-- Dumped from database version 17.5 (6bc9ef8)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: manual_order; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.manual_order VALUES (39, 'default', 'HR', '{contract_logistics.ideas.target_prices,compliance.ideas.document_administration,corp_dev.ideas.dashboard_reporting,strategic_kam.ideas.automated_news_procurement,it_business_solution_road.ideas.meeting_agent,corp_dev.ideas.product_portfolio_extension,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,it_platform_services_digital_workplace.ideas.meeting_minutes,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,it_shared_services.ideas.telematics_cost_forecast,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,it_shared_services.ideas.internal_freight_exchange,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,it_platform_services_digital_workplace.ideas.c_level_communication,it_platform_services_digital_workplace.ideas.colleague_communication,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,it_business_solution_road.ideas.edi_mapping,road_sales.ideas.unified_communication,it_platform_services_digital_workplace.ideas.project_tracking,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research,it_business_solution_road.ideas.unified_road_reporting}', '2025-10-22 13:26:35.460247+00', '2025-10-22 13:26:35.460247+00');
INSERT INTO public.manual_order VALUES (37, 'default', 'Corporate Development', '{contract_logistics.ideas.target_prices,compliance.ideas.document_administration,corp_dev.ideas.dashboard_reporting,strategic_kam.ideas.automated_news_procurement,it_business_solution_road.ideas.meeting_agent,corp_dev.ideas.product_portfolio_extension,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,it_platform_services_digital_workplace.ideas.meeting_minutes,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,it_shared_services.ideas.telematics_cost_forecast,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,it_shared_services.ideas.internal_freight_exchange,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,it_platform_services_digital_workplace.ideas.c_level_communication,it_platform_services_digital_workplace.ideas.colleague_communication,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,it_business_solution_road.ideas.edi_mapping,road_sales.ideas.unified_communication,it_platform_services_digital_workplace.ideas.project_tracking,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research,it_business_solution_road.ideas.unified_road_reporting}', '2025-10-22 13:23:26.962694+00', '2025-10-22 13:31:52.896016+00');
INSERT INTO public.manual_order VALUES (1, 'default', 'all', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_shared_services.ideas.telematics_cost_forecast,it_shared_services.ideas.internal_freight_exchange,it_platform_services_digital_workplace.ideas.c_level_communication,it_platform_services_digital_workplace.ideas.colleague_communication,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization}', '2025-10-22 12:48:49.730201+00', '2025-10-24 10:00:07.920331+00');
INSERT INTO public.manual_order VALUES (54, 'default', 'IT', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_shared_services.ideas.telematics_cost_forecast,it_shared_services.ideas.internal_freight_exchange,it_platform_services_digital_workplace.ideas.c_level_communication,it_platform_services_digital_workplace.ideas.colleague_communication,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization}', '2025-10-22 13:33:48.216697+00', '2025-10-22 13:34:06.051589+00');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.tags VALUES (2, 'Meeting Agent', 'copilot', '2025-10-21 15:52:48.889732+00');
INSERT INTO public.tags VALUES (3, 'Meeting Summarization', 'copilot', '2025-10-21 15:53:09.192369+00');
INSERT INTO public.tags VALUES (27, 'Legal Document Creation', 'document creation', '2025-10-21 17:07:27.622796+00');
INSERT INTO public.tags VALUES (28, 'Chatbot Solution for External Inquiries', 'chatbot', '2025-10-22 08:56:31.221582+00');
INSERT INTO public.tags VALUES (29, 'Automated Reading of Documents (Orders/Delivery Notes)', 'copilot', '2025-10-22 08:57:18.586309+00');
INSERT INTO public.tags VALUES (30, 'Recurring Case Chatbot', 'chatbot', '2025-10-22 08:57:56.368032+00');
INSERT INTO public.tags VALUES (31, 'Presentation Creation', 'dashboard', '2025-10-22 08:59:04.011006+00');
INSERT INTO public.tags VALUES (32, 'Intensive Research', 'research', '2025-10-22 08:59:19.801828+00');
INSERT INTO public.tags VALUES (33, 'Strategic Scenario Planning // Corporate Strategy Evaluation and Master Plan of Action Generation', 'simulations', '2025-10-22 08:59:55.834072+00');
INSERT INTO public.tags VALUES (34, 'Dashboard/Reporting Creation for Target Achievement (KAM Plans, Budget Targets, Operational Performance)', 'dashboard', '2025-10-22 09:00:14.670871+00');
INSERT INTO public.tags VALUES (35, 'AI-Supported Data Collection', 'research', '2025-10-22 09:00:59.396794+00');
INSERT INTO public.tags VALUES (36, 'Automatic Collection of All Necessary Data + CO2 Emissions Calculation', 'research', '2025-10-22 09:01:26.935039+00');
INSERT INTO public.tags VALUES (37, 'HR Agent for Questions', 'chatbot', '2025-10-22 09:01:46.87748+00');
INSERT INTO public.tags VALUES (39, 'Initiative 5', 'copilot', '2025-10-22 09:02:20.636677+00');
INSERT INTO public.tags VALUES (40, 'Initiative 1', 'dashboard', '2025-10-22 09:02:57.164768+00');
INSERT INTO public.tags VALUES (41, 'Unified Road Operations Reporting', 'dashboard', '2025-10-22 09:03:23.965256+00');
INSERT INTO public.tags VALUES (42, 'Communication / Transparency (C-Level)', 'dashboard', '2025-10-22 09:04:05.190733+00');
INSERT INTO public.tags VALUES (43, 'Communication / Transparency (Colleagues)', 'dashboard', '2025-10-22 09:04:09.509638+00');
INSERT INTO public.tags VALUES (44, 'Self-Service IT Assistant (Chatbot)', 'chatbot', '2025-10-22 09:04:17.779548+00');
INSERT INTO public.tags VALUES (45, 'AI & Automation : AI collects and sorts data', 'research', '2025-10-22 09:05:23.67499+00');
INSERT INTO public.tags VALUES (46, 'Sales Management : Sales KPI Dashboard', 'dashboard', '2025-10-22 09:05:38.535077+00');
INSERT INTO public.tags VALUES (47, 'Target Prices', 'pricing', '2025-10-22 11:33:26.628964+00');
INSERT INTO public.tags VALUES (48, 'Document Administration & Email Summarization', 'copilot', '2025-10-22 11:34:14.218557+00');
INSERT INTO public.tags VALUES (49, 'Contract', 'copilot', '2025-10-22 11:37:14.190777+00');
INSERT INTO public.tags VALUES (52, 'Contract', 'contract', '2025-10-22 11:58:13.581937+00');
INSERT INTO public.tags VALUES (53, 'Contract', 'document', '2025-10-22 11:58:18.652787+00');


--
-- Name: manual_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.manual_order_id_seq', 63, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tags_id_seq', 53, true);


--
-- PostgreSQL database dump complete
--

\unrestrict sfXqUZfCZBdUSnQE9qGCY87JwjXm01RwjaU7mKanIOONzxHs4mHPC193jcL5NfC

