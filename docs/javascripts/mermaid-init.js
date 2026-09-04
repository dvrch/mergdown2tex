// Activate Mermaid rendering for the docs site.
// The fences of the theme (class "mermaid") are turned into diagrams on load.
(function () {
  if (typeof window.mermaid === "undefined") return;

  window.mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
    flowchart: { useMaxWidth: true, htmlLabels: true },
    themeVariables: {
      primaryColor: "#e8eef9",
      primaryBorderColor: "#7b1fa2",
      lineColor: "#303030",
      fontSize: "14px"
    }
  });

  // Fences produced by pymdownx.superfences with class "mermaid" render as
  // <pre class="mermaid">; Mermaid's startOnLoad already targets ".mermaid".
  // Force a run after the document is ready, in case startOnLoad missed late DOM.
  window.addEventListener("load", function () {
    if (window.mermaid && window.mermaid.run) {
      try {
        window.mermaid.run({ querySelector: ".mermaid" });
      } catch (e) {
        /* already handled by startOnLoad */
      }
    }
  });
})();