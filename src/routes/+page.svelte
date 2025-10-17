<script lang="ts">
	let { data } = $props();
</script>

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

			<form action="/logout?/logout" method="POST">
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