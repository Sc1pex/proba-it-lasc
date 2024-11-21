<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import Navbar from "./components/Navbar.svelte";
  import Homepage from "./pages/Homepage.svelte";

  export let url = "";
</script>

<Router {url}>
  <Navbar />

  <Route path="/" component={Homepage} />
</Router>
