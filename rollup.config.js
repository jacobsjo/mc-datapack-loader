import resolve from '@rollup/plugin-commonjs';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
import dts from 'rollup-plugin-dts';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.ts',
		output: {
			name: 'mcDatapackLoader',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript()
		]
	},
	{
		input: 'src/main.ts',
		external: ["jszip"],
		plugins: [
			typescript()
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' },
		],
	},
	{
		input: 'src/main.ts',
		output: [{ file: pkg.types, format: 'es' }],
		plugins: [dts({ compilerOptions: { composite: false, incremental: false } })],
	}
];
