<script lang="ts">
	let { data } = $props();
</script>

<h1 class="text-4xl font-extrabold text-center text-sky-900 mb-10 tracking-wide font-serif">
	My Account
</h1>

<div class="flex justify-center gap-6 mb-12">
	<a
		href="/"
		class="px-6 py-2 rounded-full bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition"
	>
		Home
	</a>
	<a
		href="/orders"
		class="px-6 py-2 rounded-full bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition"
	>
		My Orders
	</a>
	<a
		href="/settings"
		class="px-6 py-2 rounded-full bg-sky-400 text-white font-semibold shadow hover:bg-sky-500 transition"
	>
		Settings
	</a>
</div>

{#if data.user}
	<div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-sky-100 p-8 space-y-8">
		<div class="flex items-center gap-6">
			<div
				class="w-20 h-20 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold text-3xl"
			>
				{data.user.name.charAt(0).toUpperCase()}
			</div>
			<div>
				<h2 class="text-2xl font-bold text-sky-900 font-serif">{data.user.name}</h2>
				<p class="text-gray-500">{data.user.email}</p>
				<p class="text-gray-600">{data.user.phone}</p>
			</div>
		</div>

		<div class="space-y-4">
			<p>
				<span class="text-sm text-gray-500">User ID:</span>
				<span class="text-lg font-semibold text-sky-900">{data.user.id}</span>
			</p>
			<p>
				<span class="text-sm text-gray-500">Email:</span>
				<span class="text-lg text-gray-700">{data.user.email}</span>
			</p>
			<p>
				<span class="text-sm text-gray-500">Phone:</span>
				<span class="text-lg text-gray-700">{data.user.phone}</span>
			</p>
		</div>

		<div class="flex gap-4 pt-6 border-t border-gray-200">
			<a
				href={`/edit/${data.user.id}`}
				class="px-5 py-2 rounded-full bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition"
			>
				Edit Profile
			</a>
			<form action="/logoutDelete?/deleteAcc" method="POST">
				<button
					class="px-5 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
				>
					Delete Account
				</button>
			</form>
		</div>
	</div>
{:else}
	<p class="text-center text-gray-500 text-lg">No user data available.</p>
{/if}