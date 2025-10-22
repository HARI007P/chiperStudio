import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import SafeSandpack from "./SafeSandpack";

const reactPackage = {
  dependencies: {
    react: "18.2.0",
    "react-dom": "18.2.0",
  },
};

export default function LivePreview({ files = [], activeFile, theme = "light" }) {
  const sandpackFiles = useMemo(() => {
    const obj = {};
    files.forEach((file) => {
      obj[file.filename] = { code: file.content || "" };
    });
    return obj;
  }, [files]);

  const entryFile = activeFile && sandpackFiles[activeFile]
    ? activeFile
    : Object.keys(sandpackFiles)[0] || "App.js";

  const providerKey = useMemo(
    () => `${entryFile}-${theme}-${JSON.stringify(sandpackFiles)}`,
    [entryFile, theme, sandpackFiles]
  );

  return (
    <SafeSandpack>
      <SandpackProvider
        key={providerKey}
        template="react"
        customSetup={reactPackage}
        files={sandpackFiles}
        options={{
          activeFile: entryFile,
          recompileMode: "immediate",
          showConsoleButton: false,
          showRefreshButton: true,
        }}
        theme={theme === "light" ? "light" : "dark"}
        customEntry={entryFile}
        style={{ width: "100%", height: "100%", borderRadius: 4, overflow: "hidden" }}
      >
        <SandpackPreview
          style={{ width: "100%", height: "100%", borderRadius: 4, overflow: "hidden" }}
        />
      </SandpackProvider>
    </SafeSandpack>
  );
}

LivePreview.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      content: PropTypes.string,
    })
  ),
  activeFile: PropTypes.string,
  theme: PropTypes.oneOf(["light", "dark"]),
};
