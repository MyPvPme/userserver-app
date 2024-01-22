import * as YAML from "js-yaml";

interface YamlSettingValue {
  [key: string]: string | YamlSettingValue;
}

export class YamlSetting {
  settings;

  constructor(settings: YamlSettingValue) {
    this.settings = settings;
  }

  static parse(content: string) {
    return new YamlSetting(YAML.load(content) as YamlSettingValue);
  }

  setFromPath(path: string, value: string) {
    const pathArray = path.split(".");

    let lastElement: YamlSettingValue = this.settings;

    pathArray.forEach((key, index) => {
      if (index + 1 === pathArray.length) {
        lastElement[key] = value;
        return;
      }
      if (!lastElement[key]) {
        lastElement[key] = {};
      }

      const newElement = lastElement[key];

      if (typeof newElement === "string") {
        throw new Error("Path not found");
      }
      lastElement = newElement;
    });
  }

  getFromPath(path: string) {
    return (
      path
        .split(".")
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .reduce((previous, current) => previous[current], this.settings)
    );
  }

  toString() {
    return YAML.dump(this.settings);
  }
}
