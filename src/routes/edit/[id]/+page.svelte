<script> 
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<h1 class="text-4xl font-extrabold text-center text-sky-900 mb-10 tracking-wide font-serif">
	Edit User
</h1>

<div class="flex justify-center mb-10">
	<a href="/account" 
	   class="px-6 py-3 rounded-full bg-gray-600 text-white font-semibold shadow-md hover:bg-gray-700 transition">
		Back to My Account
	</a>
</div>

<form method="POST" action="?/editUser" use:enhance
      class="bg-white rounded-3xl p-8 shadow-xl max-w-xl w-full mx-auto space-y-6 border border-sky-100">

	<div>
		<label for="name" class="block text-sm font-semibold text-sky-900 mb-2">Name</label>
		<input 
			type="text" 
			name="name" 
			id="name" 
			value={data.user.name}
			class="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400 focus:outline-none shadow-sm" 
		/>
	</div>

	<div>
		<label for="email" class="block text-sm font-semibold text-sky-900 mb-2">E-Mail</label>
		<input 
			type="email" 
			name="email" 
			id="email" 
			value={data.user.email}
			class="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400 focus:outline-none shadow-sm" 
		/>
	</div>

	<div>
		<label for="phone" class="block text-sm font-semibold text-sky-900 mb-2">Phone Number</label>
		<input 
			type="tel" 
			name="phone" 
			id="phone" 
			value={data.user.phone}
			class="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400 focus:outline-none shadow-sm" 
		/>
	</div>

	<button type="submit"
	        class="w-full bg-sky-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md hover:bg-sky-700 transition">
		Save Changes
	</button>
</form>