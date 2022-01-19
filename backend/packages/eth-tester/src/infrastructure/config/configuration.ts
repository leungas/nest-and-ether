import { join } from 'path';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

/**
 * @function
 * @description quick custom function to load YAML into NestJS config module
 */
export default () => {
  const CONFIG_FILE_PATH =
    process.env.CONFIG_FILE || join(__dirname, 'service.config.yaml');
  return yaml.load(readFileSync(CONFIG_FILE_PATH, 'utf-8')) as Record<
    string,
    any
  >;
};
