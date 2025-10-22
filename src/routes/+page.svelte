<script lang="ts">
	let { data } = $props();

	let filteredShops = $state(data.shops);
	let selectedCategory = $state('all');
	let searchQuery = $state('');

function filterAndSearch() {
  let shops =
    selectedCategory === 'all'
      ? data.shops
      : data.shops.filter((s) =>
          s.category_ids.includes(Number(selectedCategory))
        );

  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    shops = shops.filter((s) => s.name.toLowerCase().includes(query));
  }

  filteredShops = shops;
}
</script>

<!-- Dark hero section -->
<div class="bg-black text-gray-100 min-h-screen flex flex-col">
	<nav class="flex justify-end items-center p-6 space-x-6">
		{#if data.user}
			<!-- Logged in -->
			<a
				href="/account"
				class="text-gray-300 hover:text-white font-medium text-lg relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
			>
				My Account
			</a>

			<form action="/logoutDelete?/logout" method="POST">
				<button
					type="submit"
					class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
				>
					Logout
				</button>
			</form>
		{:else}
			<!-- Not logged in -->
			<a
				href="/login"
				class="text-gray-300 hover:text-white font-medium text-lg relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
			>
				Login
			</a>
			<a
				href="/signup"
				class="text-gray-300 hover:text-white font-medium text-lg relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
			>
				Sign Up
			</a>
		{/if}
	</nav>

	<main class="flex flex-col justify-center items-center flex-grow text-center">
		<h1 class="text-6xl md:text-7xl font-extrabold tracking-widest text-gray-200">
			GUIDO
		</h1>
		<p class="mt-4 text-lg text-gray-400 tracking-wide">
			Food • Market • Electronics
		</p>
	</main>
</div>

<!-- Light search and filter section -->
<div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
	<header class="bg-indigo-600 text-white p-6 shadow-md text-center">
		<h2 class="text-3xl font-bold">Find Your Favorite Shops</h2>
		<p class="mt-1 text-indigo-200">Search by name or filter by category</p>
	</header>

	<!-- Filters -->
	<div class="max-w-4xl mx-auto mt-6 px-4 flex flex-col md:flex-row gap-4 items-center">
		<input
			class="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
			placeholder="Search shops..."
			bind:value={searchQuery}
			oninput={filterAndSearch}
		/>
		<select
			class="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
			bind:value={selectedCategory}
			onchange={filterAndSearch}
		>
			<option value="all">All Categories</option>
			{#each data.categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
	</div>

	<!-- Shops Grid -->
	<div class="max-w-6xl mx-auto mt-8 px-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#if filteredShops && filteredShops.length > 0}
			{#each filteredShops as shop}
				<div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
					<h3 class="text-xl font-semibold text-gray-900">{shop.name}</h3>
					<p class="mt-2 text-gray-500">{shop.category_names}</p>
				</div>
			{/each}
		{:else}
			<p class="text-center text-gray-500 col-span-full">No shops found.</p>
		{/if}
	</div>
</div>
