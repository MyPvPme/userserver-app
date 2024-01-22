import * as dotProperties from "dot-properties";

export class PropertiesSetting {
  settings: dotProperties.Tree;

  constructor(settings: dotProperties.Tree) {
    this.settings = settings;
  }

  static parse(content: string) {
    return new PropertiesSetting(dotProperties.parse(content));
  }

  setFromPath(path: string, value: string) {
    this.settings[path] = value;
  }

  getFromPath(path: string, type?: "boolean") {
    const value = this.settings[path];
    if (!type) return value;

    switch (type) {
      case "boolean":
        return value === "true";
    }
  }

  toString() {
    return dotProperties.stringify(this.settings);
  }
}
