import Logo from "../assets/Logo.png"


export default function Brand({ collapsed = false }){
    return(
      <div className="flex min-w-0 items-center gap-3 shrink-0 sm:gap-4">
        <img className="w-14 shrink-0 rounded-2xl sm:w-16 lg:w-14 xl:w-16" src={Logo} alt="Paradip Port Authority logo" />
        <div className="flex min-w-0 flex-col justify-center">
          <p className="tinos-regular text-[28px] leading-none sm:text-[32px] lg:text-[clamp(26px,2.75vw,34px)] font-semibold text-white tracking-[0.02em] whitespace-nowrap">
            Paradip Port Authority
          </p>
          <p className="mt-2 text-[11px] sm:text-[12px] lg:text-[clamp(11px,1.1vw,14px)] font-semibold text-white uppercase tracking-[0.18em] whitespace-nowrap">
            Land Management System
          </p>
        </div>
      </div>
    )
}
