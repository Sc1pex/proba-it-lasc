<script lang="ts">
  import Navbar from "./components/Navbar.svelte";
  import Recipe from "./components/Recipe.svelte";
</script>

<Navbar />

<!-- images -->
<div class="relative -z-10 h-[85vh]">
  <div class="absolute inset-y-10">
    <img src="background.svg" class="h-auto w-full" />
  </div>

  <div class="absolute left-[37vw] top-[24vh] p-2 pt-2">
    <img src="logo-black.svg" class="h-[290px]" />
  </div>
</div>

<!-- top rated recipes -->
<div class="bg-dark-blue pb-10 pt-4">
  <p class="text-center text-[44px] font-bold text-white">Top rated recipes</p>

  <div class="mt-12 flex justify-around">
    <Recipe name="Reteta 1" />
    <Recipe name="Reteta 2" />
    <Recipe name="Reteta 3" />
  </div>
</div>

<!-- contact -->
<form class="grid grid-cols-5 gap-x-28 px-[15vw] py-8">
  <h1 class="text-green col-span-5 mb-10 text-[44px] font-bold">Contact us</h1>
  <div class="col-span-2">
    <input
      class="border-green placeholder-green block w-full border-2 p-2 text-[20px]"
      placeholder="First Name"
    />
    <input
      class="border-green placeholder-green mt-8 block w-full border-2 p-2 text-[20px]"
      placeholder="Last Name"
    />
    <input
      class="border-green placeholder-green mt-8 block w-full border-2 p-2 text-[20px]"
      placeholder="Email"
    />
  </div>

  <textarea
    class="border-green placeholder-green col-span-3 border-2 p-2 text-[20px]"
    placeholder="Message"
  ></textarea>

  <button
    class="bg-green col-start-5 mt-4 rounded-[15px] py-2 text-[20px] font-semibold text-white"
    >Submit</button
  >
</form>

<!-- Socials -->
<div
  class="flex h-[120px] justify-center gap-12 bg-[url('wave.svg')] bg-cover py-10"
>
  <img src="instagram.svg" />
  <img src="facebook.svg" />
  <img src="youtube.svg" />
  <img src="twitch.svg" />
</div>
