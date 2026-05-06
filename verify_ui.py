from playwright.sync_api import sync_playwright

def main():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TopBar Test</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-[#1E293B]">
        <div class="h-16 border-b border-[#334155] px-6 flex items-center justify-between">
            <button
                id="sidebar-btn"
                class="p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/><path d="m16 15-3-3 3-3"/></svg>
            </button>
            <div class="flex items-center gap-4 ml-6">
                <button
                    id="bell-btn"
                    class="relative p-2 hover:bg-[#0F172A] rounded-lg transition-colors group focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
                    title="5 alerts today"
                >
                    <span class="sr-only">Notifications, 5 alerts today</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-colors text-[#22D3EE] group-hover:text-white" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    <span class="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1E293B]" aria-hidden="true">
                    5
                    </span>
                </button>
                <div class="flex items-center gap-3 pl-3 pr-2 py-2 bg-[#0F172A] rounded-lg border border-[#334155]">
                    <button
                        id="logout-btn"
                        class="p-1.5 hover:bg-[#334155] rounded-lg transition-colors text-gray-400 hover:text-[#EF4444] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
                        title="Sign out"
                        aria-label="Sign out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html_content)

        # Test sidebar button focus
        page.focus("#sidebar-btn")
        page.screenshot(path="sidebar_focus.png")

        # Test bell button focus
        page.focus("#bell-btn")
        page.screenshot(path="bell_focus.png")

        # Test logout button focus
        page.focus("#logout-btn")
        page.screenshot(path="logout_focus.png")

        print("Screenshots taken successfully")
        browser.close()

if __name__ == "__main__":
    main()
