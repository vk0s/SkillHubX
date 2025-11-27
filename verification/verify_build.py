from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", timeout=60000)
            print("Page loaded.")

            # Wait for key elements to ensure hydration
            page.wait_for_selector("text=SkillHub")

            # Take screenshot of Homepage
            print("Taking screenshot of Homepage...")
            page.screenshot(path="verification/homepage_verified.png")

            # Navigate to Admin page (should redirect or show unauth)
            # Since we can't easily mock auth in production build without changing code,
            # we will just verify that the admin route is reachable/handled.
            print("Navigating to /admin...")
            response = page.goto("http://localhost:3000/admin")
            print(f"Admin page response: {response.status}")

            # If redirected to home or sign-in, capture that
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/admin_redirect_verified.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_homepage()
