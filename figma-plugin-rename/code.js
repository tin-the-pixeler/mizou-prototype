// Figma Plugin: Batch rename chat thread components
// Run once, then delete this plugin.

const RENAME_MAP = [
  // [matchPattern, newName, matchMode]
  // matchMode: "exact" = name must match exactly
  //            "starts" = name must start with pattern (for bracket variants)

  // event-label variants (component set + individual variants)
  ["event-label", "Chat/EventLabel", "exact"],

  // event (the parent event component, not instances)
  ["event", "Chat/Event", "exact"],

  // thinking-block → Chat/Stream (the timeline content)
  ["thinking-block", "Chat/Stream", "exact"],

  // thought-block variants → Chat/ThinkingBlock
  ["thought-block [populated]", "Chat/ThinkingBlock [populated]", "exact"],
  ["thought-block [thinking]", "Chat/ThinkingBlock [thinking]", "exact"],
  ["thought-block", "Chat/ThinkingBlock", "exact"],

  // task-block variants → Chat/TaskBlock
  ["task-block [in-progress]", "Chat/TaskBlock [in-progress]", "exact"],
  ["task-block [finished]", "Chat/TaskBlock [finished]", "exact"],
  ["task-block", "Chat/TaskBlock", "exact"],
];

function run() {
  // Find all components and component sets in the file
  const components = figma.root.findAllWithCriteria({
    types: ["COMPONENT", "COMPONENT_SET"],
  });

  // Also check frames that might be wrapper frames for these components
  const frames = figma.root.findAllWithCriteria({
    types: ["FRAME"],
  });

  const allNodes = [...components, ...frames];
  const renamed = [];

  for (const [pattern, newName, mode] of RENAME_MAP) {
    for (const node of allNodes) {
      let match = false;

      if (mode === "exact") {
        match = node.name === pattern;
      } else if (mode === "starts") {
        match = node.name.startsWith(pattern);
      }

      if (match) {
        const oldName = node.name;
        node.name = newName;
        renamed.push(oldName + "  →  " + newName);
      }
    }
  }

  // Report results
  if (renamed.length === 0) {
    figma.notify("No components found matching the rename patterns.", {
      timeout: 5000,
    });
  } else {
    figma.notify("Renamed " + renamed.length + " component(s). Check console for details.", {
      timeout: 5000,
    });
    console.log("=== RENAMED COMPONENTS ===");
    for (const entry of renamed) {
      console.log(entry);
    }
    console.log("==========================");
  }

  figma.closePlugin();
}

run();
