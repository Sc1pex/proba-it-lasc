<script lang="ts">
</script>

<div class="mt-[10vh] flex items-start justify-center">
  <form
    class="w-[38vw] rounded-[20px] bg-dark-blue px-24 pb-[6rem] pt-12 text-white"
  >
    <p
      class="font-inter text-balance text-center text-[32px] font-bold leading-10"
    >
      Loghează-te, <br /> chiorăie mațele!
    </p>

    <div class="mt-16 flex border-b px-2 pb-3">
      <img src="mail.svg" class="mr-3 w-[30px]" />
      <input
        type="email"
        class="bg-dark-blue placeholder-white focus:outline-none"
        placeholder="E-mail"
      />
    </div>

    <div class="mt-12 flex border-b px-2 pb-3">
      <img src="lock.svg" class="mr-3 w-[30px]" />
      <input
        type="password"
        class="bg-dark-blue placeholder-white focus:outline-none"
        placeholder="Password"
      />
    </div>

    <div class="mt-16 text-center">
      <button class="bg-green rounded-lg px-24 py-2 text-[32px] font-bold">
        Log in
      </button>
    </div>
    <div class="mt-8 text-center">
      <div class="text-[16px] font-bold underline">Forgot password</div>
    </div>
  </form>
</div>
