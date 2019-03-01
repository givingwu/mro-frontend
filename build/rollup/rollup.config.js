import fs from 'fs'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import { paths } from '../userConfig'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;
const outputPath = path.resolve(paths.dist1, 'js/[name].readable.js')

export default {
	input: 'src/main.js',
	output: {
		file: outputPath,
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: false
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && uglify() // minify, but only in production
	]
};
