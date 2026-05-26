import Logo from "../assets/Logo.png"


export default function Brand({ collapsed = false }){
    return(
      <div className="flex min-w-0 items-center gap-4 shrink-0">
        <img className="w-14 shrink-0 sm:w-16 rounded-2xl" src={Logo} alt="Paradip Port Authority logo" />
        <div className="flex min-w-0 flex-col justify-center">
          <p className="tinos-regular text-[28px] leading-none sm:text-[32px] lg:text-[34px] font-semibold text-white tracking-[0.02em] whitespace-nowrap">
            Paradip Port Authority
          </p>
          <p className="mt-2 text-[11px] sm:text-[12px] lg:text-[14px] font-semibold text-white uppercase tracking-[0.18em] whitespace-nowrap">
            Land Management System
          </p>
        </div>
      </div>
    )
}
