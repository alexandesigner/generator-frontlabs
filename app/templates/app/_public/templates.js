angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("home.html","<main>\n  <div class=\"block\">\n    <h1 class=\"logo\">\n        <img src=\"images/logo.png\" height=\"100\" />\n    </h1>\n    <div class=\"buttons-interactions\">\n      <a ui-sref=\"otherPage\" title=\"\" class=\"button button-docs\">\n        Other Page\n      </a>\n    </div>\n  </div>\n</main>\n");
$templateCache.put("otherPage.html","<main>\n  <header class=\"bar bar-positive\">\n    <div class=\"row\">\n      <h1 class=\"title-logo\">\n        <a href=\"/\">\n          <small>v0.1</small>\n          <img src=\"../images/logo-white.png\" height=\"42\" />\n        </a>\n      </h1>\n    </div>\n  </header>\n\n  <div class=\"content\">\n      <img src=\"../images/loading.gif\" class=\"align-center\" height=\"42\" />\n  </div>\n\n  <footer class=\"footer\">\n    <div class=\"content\">\n      Front-end Lab\'s (c) 2016 - All rights reserved.\n    </div>\n  </footer>\n</main>\n");}]);