import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	// Import all routes dynamically
	const routes = import.meta.glob('/src/routes/**/+page.svelte', { eager: true });

	// Extract folder names as links
	const navItems = Object.keys(routes)
		.map((path) => {
			// Convert "/src/routes/blog/+page.svelte" to "/blog"
			let cleanPath = path.replace('/src/routes', '').replace('/+page.svelte', '');

			// Handle root path
			if (cleanPath === '') cleanPath = '/';

			return {
				title: cleanPath === '/' ? 'Home' : cleanPath.split('/').pop(), // Use last folder name as title
				link: cleanPath
			};
		})
		.filter((route) => !route.link.includes('(')); // Exclude dynamic routes like (slug)

	return {
		navItems
	};
};
