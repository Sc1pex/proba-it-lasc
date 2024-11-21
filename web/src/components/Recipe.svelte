<script lang="ts">
  export let name: string;
</script>

<div class="flex bg-white">
  <img src="tmp/pizza.png" class="w-[14vw]" />

  <div class="border-l-green w-[14vw] border-l-2 px-4 pb-6 pt-8 text-center">
    <p class="font-bold">{name}</p>

    <div class="mt-2 flex justify-center gap-1">
      <img src="tmp/star.svg" />
      <img src="tmp/star.svg" />
      <img src="tmp/star.svg" />
      <img src="tmp/star.svg" />
      <img src="tmp/star.svg" />
    </div>

    <p class="mt-2 text-[12px] font-light">Nr ratinguri</p>

    <p class="mt-8 font-light">Autor</p>
    <p class="">Prenume Nume</p>
  </div>
</div>
