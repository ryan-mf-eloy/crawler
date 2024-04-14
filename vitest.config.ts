import {defineConfig} from 'vitest/config';

export default defineConfig({
	plugins: [],
	test: {
		testTimeout: 10000000,
		environment: 'node',
		exclude: [
			'**/node_modules/**',
			'**/build/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/functions/lib/**',
		],
		coverage: {
			exclude: [
				'**/node_modules/**',
				'**/build/**',
			],
		},
	},
});