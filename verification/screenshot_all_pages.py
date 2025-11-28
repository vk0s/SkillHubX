from playwright.sync_api import sync_playwright
import time

def screenshot_all_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a larger screen for better screenshots
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        routes = [
            {"path": "/", "name": "landing_page"},
            {"path": "/dashboard", "name": "dashboard"},
            {"path": "/upload", "name": "upload_page"},
            {"path": "/ai-helper", "name": "ai_helper_page"},
            {"path": "/admin", "name": "admin_panel"},
            {"path": "/super-admin", "name": "super_admin_panel"},
            {"path": "/suspended", "name": "suspended_page"},
        ]

        base_url = "http://localhost:3000"

        for route in routes:
            url = f"{base_url}{route['path']}"
            print(f"Navigating to {url}...")
            try:
                response = page.goto(url, timeout=30000)
                status = response.status
                print(f"Loaded {route['name']} with status {status}")

                # Wait a bit for animations/hydration
                time.sleep(2)

                # Take screenshot
                filename = f"verification/full_site_{route['name']}.png"
                page.screenshot(path=filename, full_page=True)
                print(f"Saved {filename}")

            except Exception as e:
                print(f"Failed to capture {route['name']}: {e}")

        browser.close()

if __name__ == "__main__":
    screenshot_all_pages()
