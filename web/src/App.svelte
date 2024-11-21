<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import Navbar from "./components/Navbar.svelte";
  import Homepage from "./pages/Homepage.svelte";
  import Register from "./pages/Register.svelte";
  import Login from "./pages/Login.svelte";

  export let url = "";
</script>

<Router {url}>
  <Navbar />
  <div class="absolute inset-y-10 -z-10 mt-[10vh]">
    <img src="background.svg" class="h-auto w-full" />
  </div>

  <Route path="/" component={Homepage} />
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
</Router>
