import { readFileSync } from "fs";
import { resolve } from "path";

const dataDir = resolve(__dirname);

function loadJson(name: string) {
  try {
    const raw = readFileSync(resolve(dataDir, `${name}.json`), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export const seedData = {
  products: loadJson("products"),
  categories: loadJson("categories"),
  dealers: loadJson("dealers"),
  articles: loadJson("articles"),
  ranks: loadJson("ranks"),
};
