export function Register() {
  return (
    <div className="mt-[10vh] flex items-start justify-center">
      <form className="w-[38vw] rounded-[20px] bg-dark-blue px-24 pb-16 pt-12 text-white">
        <p className="font-inter text-balance text-center text-[32px] font-bold leading-10">
          Hai, fă foamea cu noi!
        </p>

        <div className="mt-16 flex border-b px-2 pb-3">
          <img src="person.svg" className="mr-3 w-[30px]" />
          <input
            type="email"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="Full name"
          />
        </div>

        <div className="mt-8 flex border-b px-2 pb-3">
          <img src="phone.svg" className="mr-3 h-[30px] w-[30px]" />
          <input
            type="email"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="Telephone"
          />
        </div>

        <div className="mt-8 flex border-b px-2 pb-3">
          <img src="mail.svg" className="mr-3 w-[30px]" />
          <input
            type="email"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="E-mail"
          />
        </div>

        <div className="mt-8 flex border-b px-2 pb-3">
          <img src="lock.svg" className="mr-3 w-[30px]" />
          <input
            type="password"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="Password"
          />
        </div>

        <div className="mt-8 flex border-b px-2 pb-3">
          <img src="lock.svg" className="mr-3 w-[30px]" />
          <input
            type="password"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="Confirm Password"
          />
        </div>

        <div className="mt-16 text-center">
          <button className="bg-green rounded-lg px-24 py-2 text-[32px] font-bold">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
