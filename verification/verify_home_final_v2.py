from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        try:
            print("Navigating to localhost:3000...")
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=SkillHubX", timeout=10000)

            page.screenshot(path="verification/homepage_final_v2.png")
            print("Screenshot taken successfully to verification/homepage_final_v2.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_homepage()
