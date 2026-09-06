-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 010: Complete Demo & Seed Data Population
-- ============================================================================

-- 1. SEED COOPERATIVES
INSERT INTO public.cooperative_profiles (
    id, cooperative_name, registration_number, city, state, established_year, president_name, phone, official_email, address, welfare_balance
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Chennai Central District Labour Cooperative Society',
    'TN-LCS-442/2014',
    'Chennai',
    'Tamil Nadu',
    2014,
    'S. Arumugam',
    '+91 98401 22334',
    'chennaicentral@partnerplus.org',
    '14, Cooperative Bhawan, Mount Road, Anna Salai, Chennai',
    48500.00
),
(
    '22222222-2222-2222-2222-222222222222',
    'Bengaluru Urban Shramik Sahakari Sangha',
    'KA-LCS-889/2016',
    'Bengaluru',
    'Karnataka',
    2016,
    'K. Venkatappa',
    '+91 98450 11223',
    'bengaluru.urban@partnerplus.org',
    '45, Shramik Bhavan, MG Road, Bengaluru',
    62300.00
),
(
    '33333333-3333-3333-3333-333333333333',
    'Delhi Shramik Sahakari Samiti Federation',
    'DL-LCS-312/2018',
    'New Delhi',
    'Delhi',
    2018,
    'Rajendra Prasad',
    '+91 98110 55667',
    'delhi.federation@partnerplus.org',
    '88, Connaught Place, New Delhi',
    89100.00
) ON CONFLICT (registration_number) DO NOTHING;

-- 2. SEED SERVICES
INSERT INTO public.services (id, category, service_name, name_ta, name_hi, icon, description, starting_price, unit, estimated_duration, is_emergency_eligible) VALUES
('plumbing', 'plumbing', 'Plumbing & Water Supply Fix', 'பிளம்பிங் மற்றும் நீர் விநியோக சரிபார்த்தல்', 'प्लंबिंग सेवाएँ', 'Wrench', 'Main line leaks, tap replacements, flush tank overhauls, sump pump wiring', 299.00, 'per issue', '30-45 mins', true),
('electrical', 'electrical', 'Electrical Wiring & Circuit Repair', 'மின்சார வயரிங் & சுவிட்ச்போர்டு பழுது', 'इलेक्ट्रिकल सर्विस', 'Zap', 'Short circuits, MCB tripping, ceiling fan installation, inverter setup', 249.00, 'per point', '30-60 mins', true),
('carpentry', 'carpentry', 'Carpentry & Furniture Repairs', 'தச்சர் மற்றும் மரவேலை சேவைகள்', 'कारपेंटर काम', 'Hammer', 'Door hinge repair, lock fixing, modular cabinet alignment, sofa repair', 349.00, 'per item', '45-90 mins', false),
('painting', 'painting', 'Wall Painting & Waterproofing', 'பெயிண்டிங் மற்றும் நீர் தடுப்பு பூச்சு', 'पेंटिंग काम', 'Paintbrush', 'Interior wall touchups, exterior weather-proof coating, door varnish', 499.00, 'per room', '2-4 hours', false),
('cleaning', 'cleaning', 'Deep Home Cleaning & Sump Wash', 'வீடு மற்றும் நீர் தொட்டி ஆழமான தூய்மை', 'டிப் கிளீனிங்', 'Sparkles', 'Underground sump washing, kitchen degreasing, bathroom sanitization', 599.00, 'per service', '1-2 hours', false),
('caregiving', 'caregiving', 'Patient & Elderly Assistance Escort', 'நோயாளி மற்றும் முதியோர் உதவி', 'கேர்கிவிங் உதவி', 'HeartHandshake', 'Urgent elderly escort, hospital commute assistance, night care attendant', 399.00, 'per visit', '1-3 hours', true),
('driving', 'driving', 'Emergency & On-Demand Driver', 'அவசர மற்றும் தேவைக்கேற்ற ஓட்டுநர்', 'எமர்ஜென்சி டிரைவர்', 'Car', 'Immediate hospital commute, outstation drive, airport drop', 349.00, 'per trip', '30-120 mins', true),
('appliance_repair', 'appliance_repair', 'Appliance Breakdown Repair', 'சாதனம் பழுதுபார்க்கும் சேவை', 'அப்ளையன்ஸ் ரிபேர்', 'Tv', 'AC gas charging, washing machine valve repair, refrigerator defrost', 399.00, 'per appliance', '45-90 mins', true)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED SKILLS
INSERT INTO public.skills (id, category, skill_name, description, verification_required, minimum_experience_years, trade_icon) VALUES
('skill-plumber', 'SKILLED', 'Certified Master Plumber', 'Sanitary installation, PPR/CPVC pipe jointing, underground valve repair', true, 2.0, 'Wrench'),
('skill-electrician', 'SKILLED', 'Licensed Wireman & Electrician', 'Industrial & domestic 3-phase wiring, MCB distribution, inverter setup', true, 2.0, 'Zap'),
('skill-carpenter', 'SKILLED', 'Woodcraft Furniture Artisan', 'Hardwood joinery, door latch alignment, modular fitting', true, 3.0, 'Hammer'),
('skill-painter', 'SEMI_SKILLED', 'Professional Wall Painter', 'Putty sanding, Asian Paints primer application, weather guard', false, 1.0, 'Paintbrush'),
('skill-cleaner', 'GENERAL', 'Sanitization & Tank Cleaner', 'High-pressure water washing, chemical sump disinfection', false, 0.5, 'Sparkles'),
('skill-driver', 'SKILLED', 'Licensed Commercial Driver', 'Valid LMV license, emergency hospital commute expert', true, 3.0, 'Car')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED USERS & PROFILES FOR DEMO CUSTOMER & WORKERS
INSERT INTO public.users (id, auth_user_id, role, account_status, email, phone) VALUES
('00000000-0000-0000-0000-000000000001', '01111111-1111-1111-1111-111111111111', 'CUSTOMER', 'ACTIVE', 'vijay.madhesh@partnerplus.org', '+91 98409 11223'),
('00000000-0000-0000-0000-000000000002', '02222222-2222-2222-2222-222222222222', 'WORKER', 'ACTIVE', 'murugan.artisan@partnerplus.org', '+91 98412 34567'),
('00000000-0000-0000-0000-000000000003', '03333333-3333-3333-3333-333333333333', 'WORKER', 'ACTIVE', 'karthik.plumber@partnerplus.org', '+91 98403 99887'),
('00000000-0000-0000-0000-000000000004', '04444444-4444-4444-4444-444444444444', 'WORKER', 'ACTIVE', 'selvam.carpenter@partnerplus.org', '+91 98410 77665')
ON CONFLICT (id) DO NOTHING;

-- SEED CUSTOMER PROFILE
INSERT INTO public.customer_profiles (id, user_id, full_name, phone, email, address, city, state, postal_code) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Vijay Madhesh',
    '+91 98409 11223',
    'vijay.madhesh@partnerplus.org',
    'Flat 302, Green Park Apartments, 2nd Avenue, Anna Nagar',
    'Chennai',
    'Tamil Nadu',
    '600040'
) ON CONFLICT (id) DO NOTHING;

-- SEED WORKER PROFILES
INSERT INTO public.worker_profiles (
    id, user_id, cooperative_id, full_name, phone, email, profile_photo_path, worker_type, primary_skill_id, primary_skill_label, experience_years, verification_status, account_status, emergency_available, availability_status, rating, jobs_completed, current_location_name, city, latitude, longitude, service_radius_km, coop_member_id, starting_price, bio, languages
) VALUES
(
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Murugan Thangaraj',
    '+91 98412 34567',
    'murugan.artisan@partnerplus.org',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    'SKILLED',
    'electrical',
    'Electrical & Power Wiring Specialist',
    8.5,
    'VERIFIED',
    'ACTIVE',
    true,
    true,
    4.92,
    142,
    'Anna Nagar',
    'Chennai',
    13.0850,
    80.2100,
    8.0,
    'COOP-CHE-104',
    399.00,
    'Master Wireman & NSDC Certified Electrician under Chennai Central Labour Cooperative.',
    ARRAY['ta', 'en', 'hi']
),
(
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'Karthik Subramanian',
    '+91 98403 99887',
    'karthik.plumber@partnerplus.org',
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    'SKILLED',
    'plumbing',
    'Master Plumber & Pipe Fitter',
    6.0,
    'VERIFIED',
    'ACTIVE',
    true,
    true,
    4.88,
    98,
    'T. Nagar',
    'Chennai',
    13.0418,
    80.2341,
    10.0,
    'COOP-CHE-109',
    349.00,
    'Expert in main water pipeline leaks, motor replacement, and bathroom fixture installation.',
    ARRAY['ta', 'en']
),
(
    '20000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'Selvam Ramasamy',
    '+91 98410 77665',
    'selvam.carpenter@partnerplus.org',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'SKILLED',
    'carpentry',
    'Senior Wood Artisan & Furniture Specialist',
    11.0,
    'VERIFIED',
    'ACTIVE',
    false,
    true,
    4.95,
    215,
    'Mylapore',
    'Chennai',
    13.0339,
    80.2699,
    12.0,
    'COOP-CHE-118',
    449.00,
    'Specialist in antique furniture restoration, teakwood joinery, and door lock alignment.',
    ARRAY['ta']
) ON CONFLICT (id) DO NOTHING;

-- 5. SEED BOOKING & INVOICE
INSERT INTO public.bookings (
    id, booking_number, customer_id, customer_name, customer_phone, service_id, service_category, service_name, specific_task_name, worker_id, worker_name, worker_photo, worker_phone, cooperative_name, scheduled_date, start_time, problem_description, street_address, area, city, pincode, is_emergency, status, service_charge, worker_expected_earning, cooperative_welfare_fund, tax_gst, total_amount
) VALUES (
    '30000000-0000-0000-0000-000000000001',
    'BK-2026-9812',
    '10000000-0000-0000-0000-000000000001',
    'Vijay Madhesh',
    '+91 98409 11223',
    'electrical',
    'electrical',
    'Electrical Wiring & Circuit Repair',
    'Main MCB Switch Repair & Distribution Box Test',
    '20000000-0000-0000-0000-000000000002',
    'Murugan Thangaraj',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    '+91 98412 34567',
    'Chennai Central District Labour Cooperative Society',
    CURRENT_DATE,
    '10:30 AM',
    'Main distribution board sparking on heavy load. Requires immediate thermal testing.',
    'Flat 302, Green Park Apartments, 2nd Avenue',
    'Anna Nagar',
    'Chennai',
    '600040',
    true,
    'COMPLETED',
    399.00,
    379.00,
    20.00,
    20.00,
    419.00
) ON CONFLICT (id) DO NOTHING;

-- SEED INVOICE
INSERT INTO public.invoices (
    id, invoice_number, booking_id, customer_name, customer_phone, customer_address, worker_name, worker_phone, cooperative_name, cooperative_reg_no, service_category, service_name, task_name, subtotal, tax, total, worker_earnings, welfare_fund, payment_method, status
) VALUES (
    '40000000-0000-0000-0000-000000000001',
    'INV-2026-8819',
    '30000000-0000-0000-0000-000000000001',
    'Vijay Madhesh',
    '+91 98409 11223',
    'Flat 302, Green Park Apartments, 2nd Avenue, Anna Nagar',
    'Murugan Thangaraj',
    '+91 98412 34567',
    'Chennai Central District Labour Cooperative Society',
    'TN-LCS-442/2014',
    'electrical',
    'Electrical Wiring & Circuit Repair',
    'Main MCB Switch Repair & Distribution Box Test',
    399.00,
    20.00,
    419.00,
    379.00,
    20.00,
    'upi',
    'PAID'
) ON CONFLICT (id) DO NOTHING;
