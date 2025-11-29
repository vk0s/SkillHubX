# SkillHubX Comprehensive Test Plan

## Overview
**Project:** SkillHubX - AI-Powered EdTech Platform
**Scope:** Functional, Security, UI/UX, and Performance Testing
**Document Version:** 1.1

## Test Cases

### 1. Authentication & Security (Crucial)

| Test ID | Module | Scenario / Description | Steps to Reproduce | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-001** | **Auth** | **One Device, One ID Enforcement** | 1. Login to **Device A** with User X.<br>2. Login to **Device B** with User X.<br>3. Attempt action on Device A (e.g., refresh). | Session on **Device A** is invalidated/logged out immediately upon Device B login. | **Critical** |
| **AUTH-002** | **Auth** | User Signup - Email Verification | 1. Sign up with new email.<br>2. Check inbox for verification link/OTP.<br>3. Click link/enter OTP. | Account verified successfully. User logged in. | **High** |
| **AUTH-003** | **Auth** | Password Strength Rules | 1. Attempt signup with password "123".<br>2. Attempt with "Pass123!". | "123": Reject (Too weak).<br>"Pass123!": Accept. | **High** |
| **AUTH-004** | **Auth** | Admin Secure Login & Session | 1. Login as Admin.<br>2. Wait for idle timeout (e.g., 15 mins).<br>3. Refresh page. | User redirected to login page. Session expired. | **High** |
| **SEC-001** | **Security** | SQL Injection on Login | 1. Enter `' OR '1'='1` in email field.<br>2. Click Login. | System rejects input sanitization error or "Invalid credentials". No DB error exposed. | **Critical** |

### 2. AI Features (Generative AI)

| Test ID | Module | Scenario / Description | Steps to Reproduce | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AI-001** | **AI Quiz** | Quiz Generation (Standard) | 1. Enter topic "Quantum Physics".<br>2. Click "Generate". | AI generates relevant questions within defined time (<5s). | **High** |
| **AI-002** | **AI Quiz** | **Edge Case:** API Failure Handling | 1. Simulate AI API downtime/disconnect.<br>2. Click "Generate". | User sees friendly error message "AI Service busy, try again". App does not crash. | **Med** |
| **AI-003** | **AI Notes** | Formatting Retention | 1. Request notes for "World War II".<br>2. Inspect output. | Output contains Headers, Bullet points, and Bold key terms. | **Med** |
| **AI-004** | **AI Notes** | Download Functionality | 1. Generate notes.<br>2. Click "Download PDF". | PDF file downloads with correct formatting. | **Med** |
| **AI-005** | **AI Safety** | **Edge Case:** Banned Topic | 1. Input prohibited topic (e.g., "How to build a bomb").<br>2. Click Generate. | AI refuses to generate content. Warning displayed. | **High** |

### 3. Video Management System

| Test ID | Module | Scenario / Description | Steps to Reproduce | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VID-001** | **Upload** | File Format Support | 1. Upload `.mp4` file.<br>2. Upload `.mkv` file.<br>3. Upload `.exe` file. | MP4/MKV: Upload starts.<br>EXE: Rejected immediately. | **High** |
| **VID-002** | **Upload** | **Edge Case:** Network Interruption | 1. Start upload.<br>2. Disconnect Internet at 50%.<br>3. Reconnect. | Upload pauses and resumes OR fails gracefully with "Retry" option. | **Med** |
| **VID-003** | **Playback** | Quality Switching | 1. Play video.<br>2. Switch from 360p to 1080p. | Player buffers briefly and resumes in high definition. | **High** |
| **VID-004** | **Interact** | Like Counter (Real-time) | 1. User A likes video.<br>2. Check User B's screen (viewing same video). | Like count updates instantly without page refresh. | **Med** |
| **VID-005** | **Interact** | **Edge Case:** Simultaneous Likes | 1. User A and B click "Like" at exact same millisecond. | System records +2 likes correctly. No race condition error. | **Low** |
| **VID-006** | **Share** | Share Link Functionality | 1. Click "Share".<br>2. Copy link.<br>3. Open in incognito. | Link opens correct video page. | **Low** |

### 4. Dashboard & UI

| Test ID | Module | Scenario / Description | Steps to Reproduce | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UI-001** | **Responsive** | Mobile View Verification | 1. Open Dashboard on Mobile (375px). | Sidebar collapses to hamburger menu. Grid layout becomes single column. | **High** |
| **UI-002** | **Nav** | Module Transition | 1. Click "Dashboard" -> "AI Helper" -> "Upload". | Transitions are smooth. No page reloads (SPA behavior). No crashes. | **High** |
| **UI-003** | **Access** | Role-Based Access (RBAC) | 1. Login as User.<br>2. Try to access `/admin`. | Access Denied. Redirected to Home/Error page. | **Critical** |

### 5. Summary of Gaps (Code vs Requirements)
*Note: The following features requested for testing are currently **missing** from the backend schema and need implementation:*
- **Comments & Likes:** No `Comment` or `Like` models in database.
- **One Device Policy:** No custom implementation found; verified via Playwright that concurrent sessions might currently be allowed (dependent on default Clerk settings).
