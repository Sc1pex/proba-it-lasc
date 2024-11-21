<script lang="ts">
  import { Link } from "svelte-routing";
</script>

<nav
  class="flex items-center justify-between rounded-b-[25px] bg-dark-blue p-4 px-10 text-[22px] font-semibold text-white shadow-md shadow-black/50"
>
  <div class="flex items-center gap-4">
    <Link to="/">
      <img src="logo-white.svg" class="mr-[100px] h-[60px]" />
    </Link>

    <div>Recipes</div>
    <div>Add recipe</div>
  </div>

  <div class="mr-8 flex items-center gap-8">
    <Link to="/login" class="rounded-[21px] border-2 border-white px-5 py-1.5"
      >Login</Link
    >
    <Link to="/register">Register</Link>
  </div>
</nav>
