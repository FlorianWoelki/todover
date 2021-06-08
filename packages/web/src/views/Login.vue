<template>
  <div class="h-screen w-full flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow rounded-lg px-12 py-10 w-full max-w-lg space-y-6">
      <div class="flex flex-col space-y-1 w-full">
        <label for="email" class="font-semibold text-sm text-gray-500">Email address</label>
        <input
          type="email"
          class="px-3 text-sm bg-white border border-gray-300 shadow-sm rounded-lg transition duration-100 ease-in-out focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
        />
      </div>
      <div class="flex flex-col space-y-1 w-full">
        <label for="email" class="font-semibold text-sm text-gray-500">Password</label>
        <input
          type="password"
          class="px-3 text-sm bg-white border border-gray-300 shadow-sm rounded-lg transition duration-100 ease-in-out focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
        />
      </div>

      <button
        type="button"
        class="rounded-lg w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition duration-100 ease-in-out"
      >
        Register
      </button>
    </div>
  </div>
</template>
