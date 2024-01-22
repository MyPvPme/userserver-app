import spigotYml from "./server/spigot-yml.json";
import bukkitYml from "./server/bukkit-yml.json";
import serverProperties from "./server/server-properties.json";

const allDefinitions: DefinitionFile[] = (
  [serverProperties, spigotYml, bukkitYml] as RawDefinitionFile[]
).map((definition) => ({
  ...definition,
  fileVersions: definition.fileVersions.map((version) => ({
    ...version,
    supportedVersions: new RegExp(version.supportedVersions),
  })),
}));

const serverDefinitions = allDefinitions.filter(
  (definition) => definition.from === "server"
);

export default allDefinitions;

export const getDefinitionsForServerVersion = (version: string) => {
  const definitions: Definition[] = [];

  serverDefinitions.forEach((definition) => {
    const definitionVersionIndex = definition.fileVersions.findIndex(
      (fileVersion) => version.match(fileVersion.supportedVersions)
    );

    const definitionVersion = definition.fileVersions[definitionVersionIndex];

    definitions.push({
      file: definition.file,
      type: definition.type,
      from: definition.from,
      definition: definitionVersion,
      definitionIndex: definitionVersionIndex,
    });
  });

  return definitions;
};

export const getDefinitionFromFileAndIndex = (
  filename: string,
  index: number
): Definition | undefined => {
  const definition = allDefinitions.find(
    (definition) => definition.file === filename
  );
  if (!definition) return;

  const version = definition.fileVersions[index];

  return {
    file: definition.file,
    type: definition.type,
    from: definition.from,
    definition: version,
    definitionIndex: index,
  };
};

export interface Definition {
  file: string;
  type: "yaml" | "properties";
  from: string;
  definition: FileVersion;
  definitionIndex: number;
}

export interface RawDefinitionFile {
  file: string;
  type: "yaml" | "properties";
  from: string;
  fileVersions: RawFileVersion[];
}

export interface DefinitionFile
  extends Omit<RawDefinitionFile, "fileVersions"> {
  fileVersions: FileVersion[];
}

export interface RawFileVersion {
  supportedVersions: string;
  values: { path: string; type: "boolean" | "number" | "string" }[];
}

export interface FileVersion {
  supportedVersions: RegExp;
  values: { path: string; type: "boolean" | "number" | "string" }[];
}
