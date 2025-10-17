<script lang="ts">
 const { form } = $props();
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
 <form
  method="POST"
  action="?/login"
  class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-5"
 >
  <h1 class="text-3xl font-bold text-center text-gray-800">Welcome Back 👋</h1>

  {#if form?.message}
   <p class="text-center text-red-500 text-sm bg-red-50 py-2 rounded-md">{form.message}</p>
  {/if}

  <div class="flex flex-col gap-1">
   <label for="email" class="text-sm font-medium text-gray-700">E-Mail</label>
   <input
    type="email"
    id="email"
    name="email"
    required
    placeholder="you@example.com"
    class="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
   />
  </div>

  <div class="flex flex-col gap-1">
   <label for="password" class="text-sm font-medium text-gray-700">Password</label>
   <input
    type="password"
    id="password"
    name="password"
    required
    placeholder="••••••••"
    class="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
   />
  </div>

  <button
   type="submit"
   class="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all"
  >
   Login
  </button>

  <p class="text-center text-sm text-gray-600">
   Don’t have an account?
   <a href="/signup" class="text-blue-600 hover:underline font-medium">Sign Up</a>
  </p>
 </form>
</div>