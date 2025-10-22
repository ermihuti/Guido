import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { shops, categories, shops_categories } from '$lib/server/db/schema';
import { like, or, eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';

export const load: PageServerLoad = async ({ locals, url }) => {
  const searchQuery = url.searchParams.get('q') || '';

  const shopResultsRaw = await db
    .select({
      id: shops.id,
      name: shops.name,
      description: shops.description,
      category: shops.category,
      address: shops.address,
      phone: shops.phone,
      rating: shops.rating,
	  category_ids: sql<string>`GROUP_CONCAT(shops_categories.category_id) as category_ids`,
      category_names: sql<string>`GROUP_CONCAT(categories.name) AS category_names`
    })
    .from(shops)
    .leftJoin(shops_categories, eq(shops.id, shops_categories.shop_id))
    .leftJoin(categories, eq(shops_categories.category_id, categories.id))
    .where(
      or(
        like(shops.name, `%${searchQuery}%`),
        like(shops.description, `%${searchQuery}%`)
      )
    )
	.groupBy(shops.id);

	const shopResults = shopResultsRaw.map((s) => ({
    ...s,
    category_ids: s.category_ids ? s.category_ids.split(',').map(Number) : [],
    category_names: s.category_names ? s.category_names.split(',') : []
  }));

  const categoryList = await db.select().from(categories);

  return {
    user: locals.user,
    shops: shopResults,
    categories: categoryList
  };
};