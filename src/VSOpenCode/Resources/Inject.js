
(function () {
    const worktree = chrome.webview.hostObjects.sync.vsoc.GetWorktree();
    const worktreeSHA = chrome.webview.hostObjects.sync.vsoc.GetWorktreeSHA();

    const workspaceDataKey = "vsoc-workspace-" + worktreeSHA;

    console.log("Loading workspace data from " + workspaceDataKey);

    const workspaceData = JSON.parse(localStorage.getItem(workspaceDataKey)) || {};

    const workspaceKeys = [
        "opencode.global.dat:layout",
        "opencode.global.dat:model",
        "opencode.global.dat:prompt-history",

        "opencode.window.browser.dat:tabs",
        "opencode.window.browser.dat:tabs.info",
        "opencode.window.browser.dat:tabs.recent"
    ];

    const globalKeys = [
        "settings.v3",
        "opencode-theme-id"
    ];

    const tempEnv = {};

    function modify_storage(key, func) {
        const data = JSON.parse(localStorage.getItem(key) || "{}") || {};
        func(data);
        localStorage.setItem(key, JSON.stringify(data));
    }

    function ensure_storage(key, generator) {
        const val = localStorage.getItem(key);
        if (val == null || val == undefined) {
            localStorage.setItem(key, generator());
        }
    }

    const orig_setItem = localStorage.setItem.bind(localStorage);
    const orig_getItem = localStorage.getItem.bind(localStorage);

    localStorage.setItem = function (key, val) {
        if (globalKeys.includes(key)) {
            orig_setItem(key, val);
            return;
        }
        if (workspaceKeys.includes(key)) {
            workspaceData[key] = val;
            orig_setItem(workspaceDataKey, JSON.stringify(workspaceData));
            return;
        }
        tempEnv[key] = val;
    };

    localStorage.getItem = function (key) {
        if (globalKeys.includes(key)) {
            return orig_getItem(key) || null;
        }
        if (workspaceKeys.includes(key)) {
            return workspaceData[key] || null;
        }
        return tempEnv[key] || null;
    }

    // Apply New Layout

    modify_storage('settings.v3', function (data) {
        if (!data.general) {
            data.general = {};
        }

        data.general.newLayoutDesigns = true;

    });
  
    // Inject Project

    modify_storage('opencode.global.dat:server', function (data) {
        data.projects = {
            local: [
                { worktree: worktree, expanded: true }
            ]
        };

        data.list = [];

        data.lastProject = {
            local: worktree
        };

        data.recentlyClosed = {
            local: []
        };
    })

    // Tabs

    ensure_storage('opencode.window.browser.dat:tabs', () => []);
    ensure_storage('opencode.window.browser.dat:tabs.info', () => { });
    ensure_storage('opencode.window.browser.dat:tabs.recent', () => { });
})();
