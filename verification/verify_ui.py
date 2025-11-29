from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Landing Page
        print("Testing Landing Page...")
        page.goto("http://localhost:3000")
        page.screenshot(path="verification/landing_page.png")
        print("Captured landing_page.png")

        # Test Navigation Buttons on Landing Page
        # "Start Learning" should redirect to Dashboard or Login
        # Since we are not logged in, it should redirect to sign-in or similar
        print("Testing Start Learning button...")
        try:
            # Finding the button by text or href
            start_btn = page.get_by_role("link", name="Start Learning")
            if start_btn.count() > 0:
                print("Found Start Learning button")
                # We won't click it yet, just verifying it exists
        except Exception as e:
            print(f"Error finding Start Learning button: {e}")

        # Test Upload Page (Protected - should redirect)
        print("Testing Upload Page access (expect redirect)...")
        page.goto("http://localhost:3000/upload")
        page.wait_for_timeout(2000) # Wait for redirect
        page.screenshot(path="verification/upload_redirect.png")
        print("Captured upload_redirect.png (should show login or home)")

        # Test AI Helper Page (Protected?)
        # /ai-helper/quiz is protected, but /ai-helper might be public?
        # Middleware says /ai-helper/quiz(.*) and /ai-helper/notes(.*) are protected.
        # /ai-helper itself is NOT in the list explicitly?
        # Wait, regex '/ai-helper/quiz(.*)' does not cover '/ai-helper'.
        # Let's check if /ai-helper is public.
        print("Testing AI Helper Page...")
        page.goto("http://localhost:3000/ai-helper")
        page.screenshot(path="verification/ai_helper_page.png")
        print("Captured ai_helper_page.png")

        # Test AI Helper Notes (Protected)
        print("Testing AI Helper Notes (expect redirect)...")
        page.goto("http://localhost:3000/ai-helper/notes")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/ai_helper_notes_redirect.png")
        print("Captured ai_helper_notes_redirect.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
