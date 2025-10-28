--
-- PostgreSQL database dump
--

\restrict rI6aOEreF0yaKB9o0wGd6eL0uZ0PzMBBFFbkfLcuCQiDpDkQGz3KjvkiWc5pb6X

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
-- Data for Name: manual_order; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.manual_order VALUES (39, 'default', 'HR', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_shared_services.ideas.telematics_cost_forecast,it_shared_services.ideas.internal_freight_exchange,it_platform_services_digital_workplace.ideas.c_level_communication,it_platform_services_digital_workplace.ideas.colleague_communication,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization}', '2025-10-22 13:26:35.460247+00', '2025-10-24 14:26:25.021635+00');
INSERT INTO public.manual_order VALUES (54, 'default', 'IT', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_platform_services_digital_workplace.ideas.colleague_communication,it_platform_services_digital_workplace.ideas.c_level_communication,it_shared_services.ideas.telematics_cost_forecast,it_shared_services.ideas.internal_freight_exchange,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,contract_logistics.ideas.target_prices,corp_dev.ideas.dashboard_reporting,compliance.ideas.document_administration,strategic_kam.ideas.automated_news_procurement,corp_dev.ideas.product_portfolio_extension,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,road_sales.ideas.unified_communication,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research}', '2025-10-22 13:33:48.216697+00', '2025-10-24 16:34:06.830732+00');
INSERT INTO public.manual_order VALUES (1, 'default', 'all', '{it_platform_services_digital_workplace.ideas.colleague_communication,it_platform_services_digital_workplace.ideas.meeting_minutes,it_shared_services.ideas.telematics_cost_forecast,it_platform_services_digital_workplace.ideas.c_level_communication,it_shared_services.ideas.internal_freight_exchange,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,contract_logistics.ideas.target_prices,corp_dev.ideas.dashboard_reporting,compliance.ideas.document_administration,strategic_kam.ideas.automated_news_procurement,corp_dev.ideas.product_portfolio_extension,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,road_sales.ideas.unified_communication,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research}', '2025-10-22 12:48:49.730201+00', '2025-10-28 15:02:40.355093+00');
INSERT INTO public.manual_order VALUES (109, 'default', 'Controlling', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_platform_services_digital_workplace.ideas.colleague_communication,it_platform_services_digital_workplace.ideas.c_level_communication,it_shared_services.ideas.telematics_cost_forecast,it_shared_services.ideas.internal_freight_exchange,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,contract_logistics.ideas.target_prices,corp_dev.ideas.dashboard_reporting,compliance.ideas.document_administration,strategic_kam.ideas.automated_news_procurement,corp_dev.ideas.product_portfolio_extension,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,road_sales.ideas.unified_communication,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research}', '2025-10-24 16:34:08.009956+00', '2025-10-24 16:34:08.009956+00');
INSERT INTO public.manual_order VALUES (37, 'default', 'Corporate Development', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_platform_services_digital_workplace.ideas.colleague_communication,it_shared_services.ideas.telematics_cost_forecast,it_platform_services_digital_workplace.ideas.c_level_communication,it_shared_services.ideas.internal_freight_exchange,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,contract_logistics.ideas.target_prices,corp_dev.ideas.dashboard_reporting,compliance.ideas.document_administration,strategic_kam.ideas.automated_news_procurement,corp_dev.ideas.product_portfolio_extension,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,road_sales.ideas.unified_communication,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research}', '2025-10-22 13:23:26.962694+00', '2025-10-28 13:30:33.254373+00');
INSERT INTO public.manual_order VALUES (132, 'default', 'Accounting', '{it_platform_services_digital_workplace.ideas.meeting_minutes,it_platform_services_digital_workplace.ideas.colleague_communication,it_shared_services.ideas.telematics_cost_forecast,it_platform_services_digital_workplace.ideas.c_level_communication,it_shared_services.ideas.internal_freight_exchange,it_business_solution_road.ideas.automated_route_optimization,it_platform_services_digital_workplace.ideas.self_service_it_assistant,it_business_solution_road.ideas.meeting_agent,it_platform_services_digital_workplace.ideas.roadmap_creation,it_shared_services.ideas.data_quality_analysis,it_business_solution_road.ideas.edi_mapping,it_platform_services_digital_workplace.ideas.project_tracking,it_business_solution_road.ideas.unified_road_reporting,it_platform_services_digital_workplace.ideas.ticket_quality_prioritization,contract_logistics.ideas.target_prices,corp_dev.ideas.dashboard_reporting,compliance.ideas.document_administration,strategic_kam.ideas.automated_news_procurement,corp_dev.ideas.product_portfolio_extension,central_solution_design.ideas.nine_am_process,contract_logistics.ideas.contract_review,compliance.ideas.legal_document_creation,corp_dev.ideas.strategic_scenario_planning,qehs.ideas.training_management,central_solution_design.ideas.ftl_precalculation,compliance.ideas.meeting_summarization,road_sales.ideas.lead_management_prioritization,accounting.ideas.ic_differences,corp_dev.ideas.market_analysis_automation,corp_dev.ideas.competition_trend_alerts,marketing_communications.ideas.media_analysis_industry,marketing_communications.ideas.kpi_data_monitoring,marketing_communications.ideas.campaign_performance_analysis,accounting.ideas.cash_forecast,compliance.ideas.contract_analysis,compliance.ideas.recurring_case_chatbot,qehs.ideas.fake_carrier_detection,accounting.ideas.document_reading,hr.ideas.hr_data_dashboard,hr.ideas.employee_information_dashboard,accounting.ideas.chatbot_external,central_solution_design.ideas.subcontractor_database,esg.ideas.ai_text_creation,esg.ideas.automatic_customer_calculation,esg.ideas.automatic_co2_tracking,corp_dev.ideas.contract_database,corp_dev.ideas.customer_profitability_analysis,hr.ideas.hr_agent,compliance.ideas.damage_claim_review,compliance.ideas.contract_insurance_review,controlling.ideas.fp_analysis,hr.ideas.email_prioritization,marketing_communications.ideas.brand_training_assistant,road_sales.ideas.sales_kpi_dashboard,contract_logistics.ideas.requirements_specification,qehs.ideas.document_audit_automation,esg.ideas.ai_data_processing,road_sales.ideas.unified_communication,road_sales.ideas.ai_data_automation,compliance.ideas.risk_analysis_automation,esg.ideas.ai_data_collection,road_sales.ideas.automated_quote_creation,strategic_kam.ideas.ai_contract_review,marketing_communications.ideas.image_generation,strategic_kam.ideas.automated_crm_recommendations,hr.ideas.vacation_management,road_sales.ideas.automated_crm_transfer,controlling.ideas.presentation_creation,controlling.ideas.intensive_research}', '2025-10-28 08:09:29.238003+00', '2025-10-28 13:14:44.465303+00');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tags VALUES (2, 'Meeting Agent', 'copilot', '2025-10-21 15:52:48.889732+00');
INSERT INTO public.tags VALUES (3, 'Meeting Summarization', 'copilot', '2025-10-21 15:53:09.192369+00');
INSERT INTO public.tags VALUES (28, 'Chatbot Solution for External Inquiries', 'chatbot', '2025-10-22 08:56:31.221582+00');
INSERT INTO public.tags VALUES (30, 'Recurring Case Chatbot', 'chatbot', '2025-10-22 08:57:56.368032+00');
INSERT INTO public.tags VALUES (34, 'Dashboard/Reporting Creation for Target Achievement (KAM Plans, Budget Targets, Operational Performance)', 'dashboard', '2025-10-22 09:00:14.670871+00');
INSERT INTO public.tags VALUES (37, 'HR Agent for Questions', 'chatbot', '2025-10-22 09:01:46.87748+00');
INSERT INTO public.tags VALUES (39, 'Initiative 5', 'copilot', '2025-10-22 09:02:20.636677+00');
INSERT INTO public.tags VALUES (40, 'Initiative 1', 'dashboard', '2025-10-22 09:02:57.164768+00');
INSERT INTO public.tags VALUES (41, 'Unified Road Operations Reporting', 'dashboard', '2025-10-22 09:03:23.965256+00');
INSERT INTO public.tags VALUES (42, 'Communication / Transparency (C-Level)', 'dashboard', '2025-10-22 09:04:05.190733+00');
INSERT INTO public.tags VALUES (43, 'Communication / Transparency (Colleagues)', 'dashboard', '2025-10-22 09:04:09.509638+00');
INSERT INTO public.tags VALUES (44, 'Self-Service IT Assistant (Chatbot)', 'chatbot', '2025-10-22 09:04:17.779548+00');
INSERT INTO public.tags VALUES (45, 'AI & Automation : AI collects and sorts data', 'research', '2025-10-22 09:05:23.67499+00');
INSERT INTO public.tags VALUES (46, 'Sales Management : Sales KPI Dashboard', 'dashboard', '2025-10-22 09:05:38.535077+00');
INSERT INTO public.tags VALUES (48, 'Document Administration & Email Summarization', 'copilot', '2025-10-22 11:34:14.218557+00');
INSERT INTO public.tags VALUES (49, 'Contract', 'copilot', '2025-10-22 11:37:14.190777+00');
INSERT INTO public.tags VALUES (63, 'Contract Review (Insurance)', 'copilot', '2025-10-27 12:41:02.635667+00');
INSERT INTO public.tags VALUES (64, 'Document and Audit Automation', 'copilot', '2025-10-27 12:41:23.503496+00');
INSERT INTO public.tags VALUES (65, 'Intensive Research', 'copilot', '2025-10-27 12:42:06.146831+00');
INSERT INTO public.tags VALUES (66, 'Self-Service IT Assistant (Chatbot)', 'copilot', '2025-10-27 14:07:04.193392+00');
INSERT INTO public.tags VALUES (67, 'Recurring Case Chatbot', 'copilot', '2025-10-27 14:07:30.988101+00');
INSERT INTO public.tags VALUES (68, 'Chatbot Solution for External Inquiries', 'copilot', '2025-10-27 14:07:44.206156+00');
INSERT INTO public.tags VALUES (72, 'Meeting Minutes', 'meetings', '2025-10-28 08:01:14.141482+00');
INSERT INTO public.tags VALUES (73, 'Meeting Minutes', 'copilot', '2025-10-28 08:01:23.774439+00');
INSERT INTO public.tags VALUES (74, 'Automated Analysis of IC Differences', 'copilot', '2025-10-28 08:23:03.361808+00');
INSERT INTO public.tags VALUES (75, 'Automated Analysis of IC Differences', 'tbt', '2025-10-28 08:23:40.105098+00');
INSERT INTO public.tags VALUES (76, 'Automated Cash Forecast', 'refine', '2025-10-28 08:53:36.610793+00');
INSERT INTO public.tags VALUES (77, 'Automated Reading of Documents (Orders/Delivery Notes)', 'refine', '2025-10-28 08:54:46.04937+00');
INSERT INTO public.tags VALUES (78, 'Automated Reading of Documents (Orders/Delivery Notes)', 'michael', '2025-10-28 08:55:54.773569+00');
INSERT INTO public.tags VALUES (79, 'Automated Reading of Documents (Orders/Delivery Notes)', 'delivery_note_tool', '2025-10-28 08:56:17.086392+00');
INSERT INTO public.tags VALUES (80, 'Automated Reading of Documents (Orders/Delivery Notes)', 'high_roi', '2025-10-28 08:56:43.228067+00');
INSERT INTO public.tags VALUES (81, 'Chatbot Solution for External Inquiries', 'refine', '2025-10-28 09:00:20.657701+00');
INSERT INTO public.tags VALUES (82, '9 AM Process', 'copilot', '2025-10-28 09:04:19.756763+00');
INSERT INTO public.tags VALUES (83, '9 AM Process', 'agent', '2025-10-28 09:04:23.669614+00');
INSERT INTO public.tags VALUES (84, '9 AM Process', 'refine', '2025-10-28 09:04:31.201525+00');
INSERT INTO public.tags VALUES (85, 'Automated FTL Pre-calculation', 'refine', '2025-10-28 09:08:10.095015+00');
INSERT INTO public.tags VALUES (86, 'Subcontractor Database', 'refine', '2025-10-28 09:15:46.623079+00');
INSERT INTO public.tags VALUES (87, 'Subcontractor Database', 'ai_topic?', '2025-10-28 09:16:29.192294+00');
INSERT INTO public.tags VALUES (88, 'Document Administration & Email Summarization', 'refine', '2025-10-28 09:18:01.688247+00');
INSERT INTO public.tags VALUES (89, 'Legal Document Creation', 'buy', '2025-10-28 10:05:51.008441+00');
INSERT INTO public.tags VALUES (90, 'Legal Document Creation', 'review_otris', '2025-10-28 10:07:25.321922+00');
INSERT INTO public.tags VALUES (91, 'Contract & Standards Analysis', 'otris-ai', '2025-10-28 10:10:05.899975+00');
INSERT INTO public.tags VALUES (92, 'Legal Document Creation', 'otris-ai', '2025-10-28 10:10:23.232429+00');
INSERT INTO public.tags VALUES (93, 'Recurring Case Chatbot', 'refine', '2025-10-28 10:11:25.768573+00');
INSERT INTO public.tags VALUES (94, 'Damage Claim Review', 'refine', '2025-10-28 10:15:42.204517+00');
INSERT INTO public.tags VALUES (95, 'Contract Review (Insurance)', 'otris-ai', '2025-10-28 10:19:28.908252+00');
INSERT INTO public.tags VALUES (96, 'Contract Review (Insurance)', 'tbt', '2025-10-28 10:25:40.847174+00');
INSERT INTO public.tags VALUES (97, 'Risk Analysis Automation', 'refine', '2025-10-28 10:26:46.50513+00');
INSERT INTO public.tags VALUES (98, 'Target Prices', 'refine', '2025-10-28 10:27:52.941964+00');
INSERT INTO public.tags VALUES (99, 'Target Prices', 'prediction', '2025-10-28 10:28:24.837934+00');
INSERT INTO public.tags VALUES (101, 'Target Prices', 'cluster_rfq', '2025-10-28 10:30:37.2276+00');
INSERT INTO public.tags VALUES (102, 'Automated Analysis of IC Differences', 'cluster_data_analysis', '2025-10-28 10:31:52.09594+00');
INSERT INTO public.tags VALUES (103, 'Automated Cash Forecast', 'cluster_data_analysis', '2025-10-28 10:32:07.70923+00');
INSERT INTO public.tags VALUES (104, 'Automated Reading of Documents (Orders/Delivery Notes)', 'cluster_doc_analysis', '2025-10-28 10:33:30.695261+00');
INSERT INTO public.tags VALUES (105, 'Chatbot Solution for External Inquiries', 'cluster_chatbot', '2025-10-28 10:33:57.168289+00');
INSERT INTO public.tags VALUES (106, '9 AM Process', 'cluster_doc_analysis', '2025-10-28 10:34:54.392907+00');
INSERT INTO public.tags VALUES (107, 'Automated FTL Pre-calculation', 'cluster_rfq', '2025-10-28 10:35:33.228247+00');
INSERT INTO public.tags VALUES (108, 'Automated FTL Pre-calculation', 'cluster_calculation', '2025-10-28 10:35:40.918004+00');
INSERT INTO public.tags VALUES (109, '9 AM Process', 'cluster_rfq', '2025-10-28 10:35:50.570516+00');
INSERT INTO public.tags VALUES (110, 'Document Administration & Email Summarization', 'cluster_doc_analysis', '2025-10-28 10:36:34.708306+00');
INSERT INTO public.tags VALUES (112, 'Meeting Summarization', 'cluster_copilot', '2025-10-28 10:38:57.727439+00');
INSERT INTO public.tags VALUES (113, 'Contract & Standards Analysis', 'cluster_doc_analysis', '2025-10-28 10:39:13.015636+00');
INSERT INTO public.tags VALUES (114, 'Contract Review (Insurance)', 'cluster_doc_analysis', '2025-10-28 10:39:48.195383+00');
INSERT INTO public.tags VALUES (115, 'Contract', 'cluster_doc_analysis', '2025-10-28 10:40:10.163784+00');
INSERT INTO public.tags VALUES (116, 'Contract', 'otris-ai', '2025-10-28 10:40:19.147624+00');
INSERT INTO public.tags VALUES (117, 'Requirements Specification', 'refine', '2025-10-28 10:41:40.921837+00');
INSERT INTO public.tags VALUES (118, 'Fleet Performance Analysis', 'refine', '2025-10-28 10:43:09.173327+00');
INSERT INTO public.tags VALUES (119, 'Fleet Performance Analysis', 'cluster_data_analysis', '2025-10-28 10:43:15.578468+00');
INSERT INTO public.tags VALUES (120, 'Fleet Performance Analysis', 'prediction', '2025-10-28 10:43:21.044121+00');
INSERT INTO public.tags VALUES (121, 'Presentation Creation', 'refine', '2025-10-28 10:47:15.403404+00');
INSERT INTO public.tags VALUES (122, 'Presentation Creation', 'cluster_reporting', '2025-10-28 10:48:55.343361+00');
INSERT INTO public.tags VALUES (123, 'Intensive Research', 'cluster_data_analysis', '2025-10-28 10:50:21.050386+00');
INSERT INTO public.tags VALUES (124, 'Intensive Research', 'tbt', '2025-10-28 10:50:51.983842+00');
INSERT INTO public.tags VALUES (125, 'Dashboard/Reporting Creation for Target Achievement (KAM Plans, Budget Targets, Operational Performance)', 'cluster_reporting', '2025-10-28 10:53:23.527235+00');
INSERT INTO public.tags VALUES (126, 'Dashboard/Reporting Creation for Target Achievement (KAM Plans, Budget Targets, Operational Performance)', 'refine', '2025-10-28 10:54:57.626319+00');
INSERT INTO public.tags VALUES (127, 'Target: Product Portfolio Extension: - Analysis of potential product extensions based on existing customers - What business models/products/services need to be built additionally? + Make or Buy Analysis', 'refine', '2025-10-28 10:55:49.757437+00');
INSERT INTO public.tags VALUES (128, 'Strategic Scenario Planning // Corporate Strategy Evaluation and Master Plan of Action Generation', 'copilot', '2025-10-28 11:00:01.763407+00');
INSERT INTO public.tags VALUES (129, 'Strategic Scenario Planning // Corporate Strategy Evaluation and Master Plan of Action Generation', 'tbt', '2025-10-28 11:00:05.574209+00');
INSERT INTO public.tags VALUES (131, 'Strategic Scenario Planning // Corporate Strategy Evaluation and Master Plan of Action Generation', 'cluster_data_analysis', '2025-10-28 11:00:29.798675+00');
INSERT INTO public.tags VALUES (132, 'Part A External: Competition Monitoring & Trend Alerts', 'cluster_reporting', '2025-10-28 11:12:32.312618+00');
INSERT INTO public.tags VALUES (133, 'Part A External: Competition Monitoring & Trend Alerts', 'cluster_agentic_ai', '2025-10-28 11:12:41.526621+00');
INSERT INTO public.tags VALUES (134, 'Part A External: Market Analysis Automation', 'cluster_reporting', '2025-10-28 11:12:52.285404+00');
INSERT INTO public.tags VALUES (135, 'Part A External: Market Analysis Automation', 'cluster_agentic_ai', '2025-10-28 11:12:58.451406+00');
INSERT INTO public.tags VALUES (136, 'Strategic Scenario Planning // Corporate Strategy Evaluation and Master Plan of Action Generation', 'cluster_reporting', '2025-10-28 11:13:44.157021+00');
INSERT INTO public.tags VALUES (137, 'Strategic Scenario Planning // Corporate Strategy Evaluation and Master Plan of Action Generation', 'cluster_agentic_ai', '2025-10-28 11:13:49.980505+00');
INSERT INTO public.tags VALUES (138, 'Contract Data Base', 'cluster_doc_analysis', '2025-10-28 11:17:25.384126+00');
INSERT INTO public.tags VALUES (139, 'Contract Data Base', 'tms', '2025-10-28 11:19:18.624149+00');
INSERT INTO public.tags VALUES (140, 'Contract Data Base', 'otris', '2025-10-28 11:19:24.984331+00');
INSERT INTO public.tags VALUES (141, 'Contract Data Base', 'high_roi', '2025-10-28 11:20:12.093027+00');
INSERT INTO public.tags VALUES (142, 'Current: Customer Review Profitability Analysis', 'cluster_data_analysis', '2025-10-28 11:25:34.51435+00');
INSERT INTO public.tags VALUES (143, 'Current: Customer Review Profitability Analysis', 'refine', '2025-10-28 11:25:43.280943+00');
INSERT INTO public.tags VALUES (144, 'Legal Document Creation', 'cluster_content_creation', '2025-10-28 11:30:09.931871+00');
INSERT INTO public.tags VALUES (145, 'AI-Supported Text Creation', 'cluster_content_creation', '2025-10-28 11:30:24.884265+00');
INSERT INTO public.tags VALUES (146, 'AI-Supported Text Creation', 'copilot', '2025-10-28 11:30:30.952035+00');
INSERT INTO public.tags VALUES (147, 'AI-Supported Text Creation', 'tbt', '2025-10-28 11:30:35.130586+00');
INSERT INTO public.tags VALUES (148, 'Automatic Calculation + Processing of Customer Requests', 'refine', '2025-10-28 11:31:24.869586+00');
INSERT INTO public.tags VALUES (149, 'Automatic Collection of All Necessary Data + CO2 Emissions Calculation', 'refine', '2025-10-28 11:33:07.214391+00');
INSERT INTO public.tags VALUES (150, 'AI-Supported Data Processing', 'ai_topic?', '2025-10-28 11:37:50.669534+00');
INSERT INTO public.tags VALUES (151, 'AI-Supported Data Processing', 'refine', '2025-10-28 11:37:54.377324+00');
INSERT INTO public.tags VALUES (152, 'AI-Supported Data Collection', 'ai_topic?', '2025-10-28 11:38:33.19095+00');
INSERT INTO public.tags VALUES (153, 'AI-Supported Data Collection', 'refine', '2025-10-28 11:38:38.810685+00');
INSERT INTO public.tags VALUES (154, 'Initiative 1', 'refine', '2025-10-28 11:41:57.208886+00');
INSERT INTO public.tags VALUES (155, 'Initiative 1', 'ai_topic?', '2025-10-28 11:42:51.405665+00');
INSERT INTO public.tags VALUES (156, 'Initiative 2', 'refine', '2025-10-28 11:43:54.750235+00');
INSERT INTO public.tags VALUES (157, 'Initiative 2', 'integrations', '2025-10-28 11:44:06.393692+00');
INSERT INTO public.tags VALUES (158, 'HR Agent for Questions', 'refine', '2025-10-28 11:45:34.801437+00');
INSERT INTO public.tags VALUES (159, 'Target: Product Portfolio Extension: - Analysis of potential product extensions based on existing customers - What business models/products/services need to be built additionally? + Make or Buy Analysis', 'copilot', '2025-10-28 13:54:06.174546+00');
INSERT INTO public.tags VALUES (161, 'Target: Product Portfolio Extension: - Analysis of potential product extensions based on existing customers - What business models/products/services need to be built additionally? + Make or Buy Analysis', 'tbt', '2025-10-28 13:54:10.522977+00');


--
-- Name: manual_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.manual_order_id_seq', 157, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 161, true);


--
-- PostgreSQL database dump complete
--

\unrestrict rI6aOEreF0yaKB9o0wGd6eL0uZ0PzMBBFFbkfLcuCQiDpDkQGz3KjvkiWc5pb6X

