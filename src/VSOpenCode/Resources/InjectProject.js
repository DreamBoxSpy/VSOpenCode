(function() {
    var key = 'opencode.global.dat:server';
    var scope = 'local';
    var worktree = '{worktree}';

    try {
        var raw = localStorage.getItem(key);
        var data = raw ? JSON.parse(raw) : {};

        data.projects = data.projects || {};
        data.lastProject = data.lastProject || {};
        data.recentlyClosed = data.recentlyClosed || {};

        var projects = data.projects[scope] || [];
        var alreadyExists = projects.some(function(p) { return p.worktree === worktree; });

        data.projects[scope] = [{ worktree: worktree, expanded: true }];
        data.lastProject[scope] = worktree;

        var closed = data.recentlyClosed[scope] || [];
        data.recentlyClosed[scope] = closed.filter(function(w) { return w !== worktree; });

        localStorage.setItem(key, JSON.stringify(data));
        console.log('[VSOpenCode] Project injected into sidebar: ' + worktree);
    } catch(e) {
        console.error('[VSOpenCode] Failed to inject project: ' + e.message);
    }
})();
