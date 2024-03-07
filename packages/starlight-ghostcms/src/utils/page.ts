import config from 'virtual:starlight-ghostcms/config'

export function isBlogRoot(slug: string) {
	return slug === "blog";
}

export function isAnyBlogPostPage(slug: string) {
	const group = slug.split("/").pop();
	const currentslug = group?.[0];
	return currentslug;
}

export function isBlogPostPage(slug: string, postSlug: string) {
	return slug === postSlug;
}

export function isBlogTagsPage(slug: string, tag: string) {
	return slug === `blog/tags/${tag}`;
}

export function getPageProps(title: string): StarlightPageProps {
	return {
		frontmatter: {
			title,
		},
	};
}

interface StarlightPageProps {
	frontmatter: {
		title: string;
	};
}
